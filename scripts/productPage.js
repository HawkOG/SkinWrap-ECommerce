const getProductDetails = async () => {
  try {
    // const productID = sessionStorage.getItem("product_id");
    let params = new URLSearchParams(document.location.search);
    let productID = params.get("id");
    console.log("PRODUCT ID IS: " + productID);
    console.log(`product id is: ${productID}`);
    if (!productID) {
      console.error("Product ID not found in sessionStorage");
      return; // Stop execution if no product ID
    }

    const response = await fetch(
      `./scripts/getProductDetails.php?id=${productID}`
    );
    const data = await response.json();
    renderProductPage(data);
    if (data.error) {
      console.error("Error:", data.error);
    } else {
      // Call function to display product details on the page
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const renderProductPage = (data) => {
  const product_wrapper = document.getElementById("product_wrapper");
  data.forEach((product) => {
    product_wrapper.innerHTML = `<div class="container px-4 px-lg-5 my-5">
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6 border-end p-0 d-flex align-items-center justify-content-end"><img
                        class=" mb-5 w-100 align-self-end"
                        src="./uploads/${product.image}" alt="..."></div>


                <div class="row col-md-6 px-5 pr-0">
                    <h1 class="display-5 fw-bolder">${product.title}</h1>
                    <div class="d-flex gap-2">
                    <small>For ${product.make + " " + product.model}</small>
                    <small class="border-right></small>
                    <small class="small mb-1 mt-3">${product.product_id}</small>
                    </div>

                    <div class="fs-5 mb-5">

                        <span>${product.price + "€"}</span>
                    </div>
                    <span>Product description</span>
                    <p class="mt-1 lead fw-normal">${product.description}</p>
                    <div class="d-flex align-items-center gap-1">
                        <span>Qty:</span>
                        <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1" style="width:50px;">
                        <button class="btn btn-outline-dark flex-shrink-0" id="btnCart" type="button">
                            <i class="fa-solid fa-cart-plus"></i>
                            Add to cart
                        </button>
                        <button class="btn btn-outline-dark flex-shrink-0" id="btnBuy" type="button">
                            <i class="fas fa-shop"></i>
                            Buy
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>`;
    document.getElementById("btnCart").addEventListener("click", () => {
      handleAddToCart(product);
    });
    document.getElementById("btnBuy").addEventListener("click", () => {
      handleAddToCart(product);
      console.log(`Clicked buy`);
      setTimeout((window.location.href = "./a.html"), 10000);
    });
  });
};

getProductDetails();

function handleAddToCart(product) {
  console.log(product);
  // Get the existing shopping list from sessionStorage
  let shoppinglist =
    JSON.parse(localStorage.getItem("shopping_cart_content")) || [];

  if (product) {
    const listing = {
      "product-id": product.product_id,
      "product-title": product.title,
      "product-img": product.image,
      "product-price": product.price,
      "product-make": product.make,
      "product-model": product.model,
    };

    // Add to shopping list
    shoppinglist.push(listing);

    // Save to localStorage
    localStorage.setItem("shopping_cart_content", JSON.stringify(shoppinglist));

    // Update UI
    getSessionData();
    renderShoppingCart();
  }
}
