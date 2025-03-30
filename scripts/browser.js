const devModel = document.getElementById("dev_model");
const devMake = document.getElementById("dev_make");
const productWrapper = document.getElementById("productWrapper");
let deviceMake = "";
let deviceModel = "";
const itemsPerPage = 20; // Number of products per page
let currentPage = 1; // Track current page
let totalPages = 0; // Will be calculated after fetch
let productsData = []; // Store fetch response globally for pagination

const makeAndModelFiller = () => {
  const make = ["Apple", "Samsung", "Google"];
  const phoneModels = {
    0: [
      "iPhone 13 Pro",
      "iPhone 13 Pro Max",
      "iPhone SE (3rd generation)",
      "iPhone 14",
      "iPhone 14 Plus",
      "iPhone 14 Pro",
      "iPhone 14 Pro Max",
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
    ],
    1: [
      "Galaxy S23",
      "Galaxy S23+",
      "Galaxy S23 Ultra",
      "Galaxy S24",
      "Galaxy S24+",
      "Galaxy S24 Ultra",
      "Galaxy S25",
      "Galaxy S25+",
      "Galaxy S25 Ultra",
    ],
    2: [
      "Pixel 7",
      "Pixel 7 Pro",
      "Pixel 7a",
      "Pixel 8",
      "Pixel 8 Pro",
      "Pixel 8a",
      "Pixel 9",
      "Pixel 9 Pro",
      "Pixel 9 Pro XL",
    ],
  };

  for (let i = 0; i < make.length; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerText = make[i];
    devMake.appendChild(option);
  }

  devMake.addEventListener("change", () => {
    deviceModel = "";
    const selectedMake = devMake.value;
    const models = phoneModels[selectedMake] || [];
    devModel.innerHTML = "";

    for (let i = 0; i < models.length; i++) {
      let option = document.createElement("option");
      option.innerText = models[i];
      option.value = models[i];
      devModel.appendChild(option);
    }
    deviceMake = devMake.options[devMake.selectedIndex].innerText;
    filterProducts();
  });

  devModel.addEventListener("change", () => {
    deviceMake = devMake.options[devMake.selectedIndex].innerText;
    deviceModel = devModel.value;
    console.log(`Selected: ${deviceMake} ${deviceModel}`);
    filterProducts();
  });

  devMake.dispatchEvent(new Event("change"));
};

const filterProducts = async () => {
  try {
    const encodedModel = encodeURIComponent(deviceModel);
    const encodedMake = encodeURIComponent(deviceMake);
    const data = await fetch(
      `./scripts/browseFilterProducts.php?make=${encodedMake}&model=${encodedModel}`
    );
    const response = await data.json();
    console.log(response);
    productsData = response; // Store full response for pagination
    totalPages = Math.ceil(productsData.length / itemsPerPage); // Calculate total pages

    const filterCounter = document.querySelector(".filterCounter");
    if (filterCounter) {
      if (productsData.length === 0) {
        filterCounter.innerText = `No results found`;
      } else if (deviceMake && deviceModel) {
        filterCounter.innerText = `Showing ${productsData.length} results for ${deviceMake} ${deviceModel}`;
      } else {
        filterCounter.innerText = `Showing all results (${productsData.length})`;
      }
    }

    renderPage(currentPage); // Render the first page
    setupPagination(); // Setup pagination controls
  } catch (error) {
    console.error("Filter error:", error);
  }
};

// Render products for the current page
const renderPage = (page) => {
  console.log(page);
  productWrapper.innerHTML = "";
  const start = (page - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, productsData.length);
  const pageItems = productsData.slice(start, end);

  pageItems.forEach((prod) => {
    productWrapper.innerHTML += `
      <div class="col">
        <div class="card border-0">
          <div class="image-container">
            <a href="product.html?id=${prod.product_id}" class="product-link" data-id="${prod.product_id}">
              <img src="./uploads/${prod.image}" alt="${prod.title}" class="card-img-top" />
            </a>
          </div>
          <div class="card-body text-center flex-column">
            <h3 class="h5">
              <a href="product.html?id=${prod.product_id}" class="text-dark text-decoration-none product-link" data-id="${prod.product_id}">${prod.title}</a>
            </h3>
            <div class="mt-2">
              <p class="fw-semibold text-dark mt-1">${prod.price}€</p>
            </div>
            <button class="btn btn-outline-dark rounded-0 cartButton mt-auto" 
              data-id="${prod.product_id}" 
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

  // Reattach event listeners for cart buttons
  const cartButtons = document.querySelectorAll(".cartButton");
  cartButtons.forEach((item) => {
    item.addEventListener("click", () => {
      const attr = item.getAttribute("data-id");
      handleAddToCart(attr);
    });
  });

  // Reattach event listeners for product links
  const items = document.querySelectorAll(".product-link");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("data-id");
      fetchProductDetails(id);
    });
  });

  // Add fade-in animation
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("fade-in");
      card.classList.add("visible");
    }, 50 + 50 * index);
  });
};

// Setup pagination controls
const setupPagination = () => {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageNumbers = document.getElementById("pageNumbers");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-outline-primary ${
      i === currentPage ? "active" : ""
    }`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      updateActivePage(i);
    });
    pageNumbers.appendChild(btn);
  }

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      updateActivePage(currentPage);
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      updateActivePage(currentPage);
    }
  };
};

// Update active page number styling
const updateActivePage = (current) => {
  const buttons = document.querySelectorAll("#pageNumbers .btn");
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", index + 1 === current);
  });
};

function handleAddToCart(productID) {
  let button = document.querySelector(`.cartButton[data-id="${productID}"]`);
  if (!button) return;

  const listing = {
    "product-id": productID,
    "product-title": button.getAttribute("data-title"),
    "product-img": button.getAttribute("data-image"),
    "product-price": button.getAttribute("data-price"),
    "product-make": button.getAttribute("data-make"),
    "product-model": button.getAttribute("data-model"),
  };

  let shoppinglist = getSessionData() || [];
  shoppinglist.push(listing);
  saveSessionData(shoppinglist);
  getSessionData();
  showAlert(`Product successfully added to cart!`, "custom");
}

const resetFilter = (e) => {
  e.preventDefault();
  deviceMake = "";
  deviceModel = "";
  devMake.value = "0";
  devModel.value = "";
  devMake.dispatchEvent(new Event("change"));
  filterProducts();
};

document.querySelector(".resetFilter").addEventListener("click", resetFilter);

// Initial load
filterProducts();
makeAndModelFiller();
