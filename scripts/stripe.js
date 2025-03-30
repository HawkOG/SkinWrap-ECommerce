const stripe = Stripe(
  "pk_test_51Qs3NMPvDvk9jk0fcgoQelCxDImRCoaO94NLScpn03TknvOARQ9vT8ge3PbNtJNStLTMiQUAZ6F1LorWsCju0FXI00MNmm8oEP"
);

let elements;
let persistentCart = [];
let persistentOrderID = "";
let isSubmitting = false;

document.addEventListener("DOMContentLoaded", () => {
  persistentCart =
    JSON.parse(localStorage.getItem("shopping_cart_content")) || [];
  renderCart();
  initialize();
});

function renderCart() {
  const checkoutList = document.getElementById("checkout-list");
  if (!checkoutList) return;

  checkoutList.innerHTML = "";

  if (persistentCart.length === 0) {
    document.getElementById(
      "notifier"
    ).innerHTML = `<span class="text-center fs-4">Your cart is empty.</span>`;
    document.querySelector(".table").style.display = "none";
    document.getElementById("checkoutPriceTotal").innerHTML = "";
  } else {
    document.querySelector(".table").style.display = "table";
    persistentCart.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="align-middle">${index + 1}</td>
        <td class="align-middle">
          <img src="./uploads/${item["product-img"]}" alt="${item["product-title"]
        }" width="150">
          ${item["product-title"]}
          <span>${item["product-make"] ? item["product-make"] : " "} ${item["product-model"] ? item["product-model"] : ""
        }</span>
        </td>
        <td class="align-middle"><strong>${item["product-price"]}€</strong></td>
      `;
      checkoutList.appendChild(tr);
    });

    const total = persistentCart.reduce(
      (sum, item) => sum + parseFloat(item["product-price"] || 0),
      0
    );
    document.getElementById("checkoutPriceTotal").innerHTML = `${total.toFixed(
      2
    )}€`;
  }
}

async function initialize() {
  if (persistentCart.length === 0) {
    showMessage("Your cart is empty. Add items before checking out.");
    return;
  }

  persistentOrderID = Date.now().toString();
  localStorage.setItem("order_id", persistentOrderID);
  localStorage.setItem("cart_backup", JSON.stringify(persistentCart));
  console.log("Generated orderID:", persistentOrderID);
  console.log(
    "Stored order_id in localStorage:",
    localStorage.getItem("order_id")
  );
  console.log("Cart in initialize:", persistentCart);
  console.log(
    "Stored cart_backup in localStorage:",
    localStorage.getItem("cart_backup")
  );

  const response = await fetch("./scripts/create-payment-intent.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: persistentCart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item["product-title"] },
          unit_amount: parseFloat(item["product-price"]) * 100,
        },
        product_id: item["product-id"],
      })),
      order_id: persistentOrderID,
    }),
  });

  const data = await response.json();
  console.log("Response from create-payment-intent.php:", data);

  if (data.error) {
    console.error("Error creating payment intent:", data.error);
    showMessage("Failed to initialize payment.");
    return;
  }

  const { clientSecret } = data;
  elements = stripe.elements({ appearance: { theme: "stripe" }, clientSecret });

  const paymentEl = elements.create("payment", {
    fields: {
      billingDetails: {
        address: "auto",
      },
    },
  });
  paymentEl.mount("#payment-element");

  const addressEl = elements.create("address", {
    mode: "shipping",
    fields: {
      line1: "always",
      line2: "never",
      city: "always",
      state: "auto",
      postalCode: "always",
      country: "always",
      phone: "never",
      name: "always",
    },
    validation: {
      line1: { required: "always" },
      city: { required: "always" },
      postalCode: { required: "always" },
      country: { required: "always" },
      name: { required: "always" },
    },
    allowedCountries: ["US", "CA", "GB", "LT"],
  });
  addressEl.mount("#address-element");

  addressEl.on("change", (event) => {
    console.log("Address changed:", event.value);
  });

  paymentEl.on("ready", () => {
    setTimeout(
      () => document.querySelector(".stripe_loader")?.classList.add("fadeOut"),
      100
    );
    setTimeout(() => {
      const form = document.getElementById("payment-form");
      if (form) {
        form.classList.remove("opacity-0");
        form.classList.add("fadeIn");
      }
      document.querySelector(".stripe_loader")?.remove();
    }, 700);
  });

  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    console.log("Attaching submit event listener to payment form");
    paymentForm.addEventListener("submit", (e) => handleSubmit(e, addressEl));
  } else {
    console.error("Payment form element not found when attaching listener");
  }
}

async function handleSubmit(e, addressEl) {
  e.preventDefault();
  if (isSubmitting) return;
  isSubmitting = true;

  const submitButton = document.getElementById("submit");
  submitButton.disabled = true;
  console.log("handleSubmit triggered");

  try {
    // Get address data from Stripe's address element
    const addressData = await addressEl.getValue();
    console.log("Raw addressData from getValue:", addressData);

    // Extract value from addressData
    const value = addressData && addressData.value ? addressData.value : null;
    console.log("Extracted value:", value);

    if (!value || !value.address || !value.name) {
      showMessage("Please fill out all required address fields.");
      submitButton.disabled = false;
      isSubmitting = false;
      return;
    }

    const customerDetails = {
      customer_name: value.name,
      address_line1: value.address.line1,
      city: value.address.city,
      state: value.address.state || "",
      postal_code: value.address.postal_code,
      country: value.address.country,
    };

    console.log("Constructed customerDetails:", customerDetails);

    // Validate required fields (state can be empty)
    const requiredFields = [
      "customer_name",
      "address_line1",
      "city",
      "postal_code",
      "country",
    ];
    const missingFields = requiredFields.filter(
      (key) => !customerDetails[key] || customerDetails[key].trim() === ""
    );
    if (missingFields.length > 0) {
      showMessage(`Please fill out: ${missingFields.join(", ")}`);
      submitButton.disabled = false;
      isSubmitting = false;
      return;
    }

    localStorage.setItem("customer_details", JSON.stringify(customerDetails));
    console.log("Stored customer_details in localStorage:", customerDetails);

    console.log("Starting payment confirmation");
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://localhost:8443/blog/complete.html?order_id=${encodeURIComponent(
          persistentOrderID
        )}`,
      },
    });

    if (result.error) {
      console.error("Payment error:", result.error);
      showMessage(result.error.message);
      submitButton.disabled = false;
      isSubmitting = false;
      return;
    }

    console.log(
      "Payment successful, expecting redirect:",
      result.paymentIntent
    );
  } catch (err) {
    console.error("Submit error:", err);
    showMessage("An unexpected error occurred during payment: " + err.message);
    submitButton.disabled = false;
    isSubmitting = false;
  }
}

function showMessage(message) {
  const notifier =
    document.getElementById("notifier") || document.createElement("div");
  if (!notifier.id) {
    notifier.id = "notifier";
    document.body.appendChild(notifier);
  }
  notifier.innerHTML = `<div class="alert alert-info">${message}</div>`;
}
