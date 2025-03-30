let navBtn = document.getElementById("shoppingCartButton");
let navCart = document.getElementById("navcart");
let checkOutBox = document.getElementById("shoppingCartBody");
const cartOptions = document.querySelector(".cartOptions");
const cartPrice = document.getElementById("cartPrice");
// Get cart data from localStorage
const getSessionData = () => {
  const cartData = localStorage.getItem("shopping_cart_content");
  try {
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.log("Invalid cart data, resetting.");
    localStorage.removeItem("shopping_cart_content");
    return [];
  }
};

// Save cart data to localStorage
const saveSessionData = (data) => {
  localStorage.setItem("shopping_cart_content", JSON.stringify(data));
  renderShoppingCart(); // Re-render immediately after saving
};

// Reset cart UI to empty state
const resetCartUI = () => {
  navCart.style.height = "55px";
  navCart.style.overflowY = "auto";
  // navCart.innerHTML = `<p class="m-0 pt-2 text-center">Your cart is empty</p>`;
  navCart.innerHTML = `<div class="m-0 fw-bold p-3 text-center">Your cart is empty!</div>`;
  cartPrice.innerHTML = "";
  cartOptions.style.display = "none";
};

// Render the shopping cart UI
const renderShoppingCart = () => {
  cartOptions.style.display = "block";
  const data = getSessionData();
  navCart.style.height = "400px";
  if (!data || data.length === 0) {
    resetCartUI();
    navBtn.innerHTML = `<i class="fa-solid fa-cart-shopping text-light"></i>`;
  } else {
    navBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${
      data.length
    } item${data.length > 1 ? "s" : ""}`;
    navCart.innerHTML = ""; // Clear previous items

    data.forEach((product, index) => {
      navCart.innerHTML += `
      <div class="cart-item d-flex align-items-center justify-content-between p-2 mb-2 rounded bg-light">
      
  <a href="product.html?id=${product["product-id"]}" class="viewProduct d-flex align-items-center text-decoration-none flex-grow-1" data-id=${product["product-id"]}>
    <div class="cart-image me-3">
      <img src="./uploads/${product["product-img"]}" alt="${product["product-title"]}" class="rounded img-responsive" style="width: 100px; height: 100px; object-fit: cover;" />
    </div>
    <div class="cart-details">
      <h6 class="mb-0 text-dark fw-bold fs-5" data-id="${product["product-id"]}">${product["product-title"]}</h6>
      <small class="mb-0 text-muted fw-thin" data-id="${product["product-id"]}">for ${product["product-make"]} ${product["product-model"]}</h6>
      <p class="fw-bolder fs-5">${product["product-price"]}€</p>
    </div>
  </a>
  <button class="btn fw-bolder remove" data-index="${index}">
    <i class="fa-solid fa-x"></i>
  </button>
</div>
      `;
    });

    // Add remove button listeners
    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        removeProductFromCart(index);
      });
    });

    getPrices(); // Update total price

    const items = document.querySelectorAll(".viewProduct");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        viewItem(id); // pass the dataID attribute
        window.location.href = `./product.html?id=${id}`;
      });
    });
  }
};

// Remove item from cart
const removeProductFromCart = (index) => {
  let cartData = getSessionData();
  cartData.splice(index, 1); // Remove item
  saveSessionData(cartData); // Save and re-render
};

// Calculate and display total price
const getPrices = () => {
  const data = getSessionData();
  let price = 0;

  if (data.length > 0) {
    cartPrice.style.fontWeight = "bold";
    price = data.reduce((sum, item) => {
      const itemPrice = parseFloat(item["product-price"]);
      return sum + (isNaN(itemPrice) ? 0 : itemPrice);
    }, 0);
    cartPrice.innerText = `Total: ${price.toFixed(2)}€`;
  } else {
    cartPrice.innerText = "";
  }
};

// Clear the cart
const wipeCartData = () => {
  localStorage.removeItem("shopping_cart_content");
  renderShoppingCart(); // Re-render after clearing
};

// Listen for storage changes (e.g., from another tab or script)
window.addEventListener("storage", (e) => {
  if (e.key === "shopping_cart_content") {
    renderShoppingCart(); // Re-render if cart data changes
  }
});

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
  renderShoppingCart(); // Initial render
  document.getElementById("clearCart").addEventListener("click", wipeCartData);
});

// Example function to add an item (you might have this elsewhere)
const addToCart = (product) => {
  let cartData = getSessionData();
  cartData.push(product);
  saveSessionData(cartData); // Save and re-render
};

const checkout = () => {
  window.location.href = "./checkout.html";
};
