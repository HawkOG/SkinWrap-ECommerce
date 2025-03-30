async function fetchPaymentIntent() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentIntentID = urlParams.get("payment_intent");
  const orderID = urlParams.get("order_id");
  const payment_status = document.querySelector(".payment-status");
  let alert = document.getElementById("order-details");
  console.log(
    "URL Parameters - paymentIntentID:",
    paymentIntentID,
    "orderID:",
    orderID
  );

  if (!paymentIntentID || !orderID) {
    document.getElementById("order-details").innerHTML =
      "Error: Missing payment intent or order ID.";
    payment_status.innerText = "Payment incomplete";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart_backup")) || [];
  console.log("Cart from localStorage:", cart);
  if (cart.length === 0) {
    alert.innerHTML = "Error: Cart is empty.";
    alert.classList.add("alert-danger");
    payment_status.innerText = "Payment incomplete";
    console.error("CART NOT FOUND");
    return;
  }

  const customerDetails =
    JSON.parse(localStorage.getItem("customer_details")) || {};
  console.log("Customer details from localStorage:", customerDetails);

  const requestBody = {
    paymentIntentID: paymentIntentID,
    orderID: orderID,
    items: cart.map((item) => ({
      "product-id": item["product-id"],
      "product-title": item["product-title"],
      "product-price": parseFloat(item["product-price"]),
      "product-make": item["product-make"] || "Unknown",
      "product-model": item["product-model"] || "Unknown",
      "product-img": item["product-img"],
    })),
    customer: {
      customer_name: customerDetails.customer_name,
      address_line1: customerDetails.address_line1,
      city: customerDetails.city,
      state: customerDetails.state,
      postal_code: customerDetails.postal_code,
      country: customerDetails.country,
    },
  };
  console.log(
    "Sending to retrieve-payment-intent.php:",
    JSON.stringify(requestBody, null, 2)
  ); // Full object log

  try {
    const response = await fetch("./scripts/retrieve-payment-intent.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    console.log("Response from retrieve-payment-intent.php:", data);

    if (data.success) {
      alert.classList.add("alert-success");
      document.getElementById(
        "order-details"
      ).innerHTML = `Payment completed! Thank you for shopping, we really appreciate you!`;
      localStorage.removeItem("shopping_cart_content");
      localStorage.removeItem("order_id");
      localStorage.removeItem("payment_intent_id");
      localStorage.removeItem("cart_backup");
      localStorage.removeItem("customer_details");
    } else {
      document.getElementById("order-details").innerHTML =
        "Payment verified, but save failed: " + (data.error || "Unknown error");
      payment_status.innerText = "Payment incomplete";
      console.error("Failed to save order:", data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("order-details").innerHTML =
      "Error saving order: " + error.message;
    payment_status.innerText = "Payment incomplete";
  }
}

const redirectIn = (time) => {
  document.getElementById(
    "redirect-notification"
  ).innerText = `Redirecting in ${time} seconds`;
  if (time < 0) {
    window.location.href = "./";
  } else {
    setTimeout(() => {
      time--;
      console.log(time);
      redirectIn(time);
    }, 1000);
  }
};

redirectIn(20);
fetchPaymentIntent();
