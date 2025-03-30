function createProductsList(res) {
  let productHTML = "";
  res.splice(8, 4).forEach((prod) => {
    productHTML += ` 
          <div class="col">
            <div class="card border-0">
              <div class="image-container">
                <a href="product.html?id=${prod.product_id}" class="product-link" data-id="${prod.product_id}">
                  <img src="./uploads/${prod.image}" alt="${prod.title}" class="card-img-top" />
                </a>
              </div>
              <div class="card-body text-center flex-column">
                <h3 class="h5">
                  <a href="product.html?id=${prod.product_id}" class="fs-5 text-dark text-decoration-none product-link" data-id="${prod.product_id}">${prod.title}</a>
                </h3>
                <div class="mt-2">
                  <p class="fw-semibold text-dark mt-1 fs-5">${prod.price}€</p>
                </div>
                <button class="btn btn-outline-dark rounded-0 cartButton mt-auto" data-id="${prod.product_id}" 
                  data-title="${prod.title}" 
                  data-image="${prod.image}" 
                  data-price="${prod.price}"
                  data-make="${prod.make}"
                  data-model="${prod.model}">
                  <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>`;
  });

  productWrapper.innerHTML = productHTML; // Update the DOM once to reduce reflow

  attachEventListeners();

  function attachEventListeners() {
    // Select all product links (title & image)
    let productLinks = document.querySelectorAll(".product-link");

    productLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link navigation
        const productID = link.getAttribute("data-id");
        fetchProductDetails(productID);

        // // Store product ID in sessionStorage
        // sessionStorage.setItem("product_id", productID);

        // Redirect to product page
        // window.location.href = `product.html?productID=${productID}`;
      });
    });

    // Select all cart buttons
    let allButtons = document.querySelectorAll(".cartButton");
    allButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productID = button.getAttribute("data-id");
        handleAddToCart(productID);
      });
    });
  }

  function handleAddToCart(productID) {
    let button = document.querySelector(`.cartButton[data-id="${productID}"]`);

    if (!button) return; // Prevent error if button is not found

    const listing = {
      "product-id": productID,
      "product-title": button.getAttribute("data-title"),
      "product-img": button.getAttribute("data-image"),
      "product-price": button.getAttribute("data-price"),
      "product-make": button.getAttribute("data-make"),
      "product-model": button.getAttribute("data-model"),
    };

    // Get the existing shopping list from localStorage
    let shoppinglist = getSessionData();

    shoppinglist.push(listing);

    // Save updated cart to localStorage
    saveSessionData(shoppinglist);

    // Update UI
    getSessionData();
    showAlert(`Product successfully added to cart!`, "custom");
  }

  const productsFadeIn = () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("fade-in");
        card.classList.add("visible");
      }, 50 + 50 * index);
    });
  };
  productsFadeIn();
}

function fetchProductDetails(id) {
  const url = `./getProduct.php?product_id=${encodeURIComponent(id)}`;
  console.log("Fetching URL:", url); // Log the API request URL

  fetch(url)
    .then((response) => response.json()) // First read as text (to debug)
    .then(
      (response) =>
        (window.location.href = `./product.html?id=${response.product_id}`)
    );
}
