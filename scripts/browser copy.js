const devModel = document.getElementById("dev_model");
const devMake = document.getElementById("dev_make");
const productWrapper = document.getElementById("productWrapper");
let deviceMake = "";
let deviceModel = "";
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

  // Populate devMake with manufacturers
  for (let i = 0; i < make.length; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerText = make[i];
    devMake.appendChild(option);
  }
  // Populate devModel based on devMake selection
  devMake.addEventListener("change", () => {
    deviceModel = "";
    const selectedMake = devMake.value; // e.g., "0", "1", "2"
    const models = phoneModels[selectedMake] || [];
    devModel.innerHTML = ""; // Clear previous options

    for (let i = 0; i < models.length; i++) {
      let option = document.createElement("option");
      option.innerText = models[i];
      option.value = models[i];
      devModel.appendChild(option);
    }
  });

  // Log selection when devModel changes
  devModel.addEventListener("change", () => {
    const selectedMakeIndex = devMake.value; // Current index
    const selectedMakeText = devMake.options[selectedMakeIndex].innerText; // Current manufacturer name
    const selectedModel = devModel.value; // Current model

    console.log(`Selected: ${selectedMakeText} ${selectedModel}`);
    deviceMake = selectedMakeText;
    deviceModel = selectedModel;
    filterProducts();
  });

  devMake.dispatchEvent(new Event("change")); // Trigger initial population
};

const filterProducts = async (e) => {
  try {
    e.preventDefault();
    // Simple test to see what the filter shows after selecting the model
    const data = await fetch(
      `./scripts/browseFilterProducts.php?make=${deviceMake}&model=${deviceModel}`
    );
    const response = await data.json();
    console.log(response);

    productWrapper.innerHTML = "";
    response.forEach((prod) => {
      productWrapper.innerHTML += `
          <div class="col">
            <div class="card border-0">
              <div class="image-container">
                <a href="product.html?product=${encodeURIComponent(
                  prod.title
                )}&id=${prod.product_id}" class="product-link" data-id="${
        prod.product_id
      }">
                  <img src="./uploads/${prod.image}" alt="${
        prod.title
      }" class="card-img-top" />
                </a>
              </div>
              <div class="card-body text-center flex-column">
                <h3 class="h5">
                  <a href="product.html?id=${
                    prod.product_id
                  }" class="text-dark text-decoration-none product-link" data-id="${
        prod.product_id
      }">${prod.title}</a>
                </h3>
                <div class="mt-2">
                  <p class="fw-semibold text-dark mt-1">${prod.price}€</p>
                </div>
                <button class="btn btn-outline-success cartButton mt-auto" 
                  data-id="${prod.product_id}" 
                  data-title="${prod.title}" 
                  data-image="${prod.image}" 
                  data-price="${prod.price}">
                  <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>`;
    });
  } catch (error) {}
};
const form = document.getElementById("filterProducts");
form.addEventListener("submit", filterProducts);

const resetFilter = () => {
  deviceMake = "";
  deviceModel = "";
  productWrapper.innerHTML = "";
  filterProducts();
};

document
  .querySelector(".resetFilter")
  .addEventListener("click", () => resetFilter());

filterProducts();
makeAndModelFiller();
