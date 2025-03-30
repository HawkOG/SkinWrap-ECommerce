function createNavbar() {
  const navbar = document.createElement("div");
  navbar.className =
    "container-fluid bg-light shadow sticky-top nb align-items-center d-flex";
  navbar.innerHTML = `
        <div class="container p-0">
    <div class="row w-100">
      <div class="navbar px-0 d-flex justify-content-between align-items-center w-100" style="position: relative;">
        <div id="userNameWrapper" class="navbar-brand">
          <a href="./" class="mt-0 navbar_backHome text-light"><i class="fa fa-home"></i></a>
        </div>
        <div class="navbar-brand" id="brandName" style="position: absolute; left: 50%; transform: translateX(-50%);">
          <a href="./"><h1 class="m-0 fs-4 fw-bolder">Skinology</h1></a>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div id="userArea" class="d-flex gap-2"></div>
          <div id="shoppingCartWrapper">
            <div class="dropdown" id="append">
              <button class="dropdown-toggle btn text-light" type="button" id="shoppingCartButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-cart-shopping"></i>
              </button>
              
              <ul class="dropdown-menu dropdown-menu-end p-2" id="shoppingCartBody" aria-labelledby="shoppingCartButton">
                <div id="navcart"></div>
                <div class="d-flex text-center justify-content-between align-items-center flex-row gap-2 pt-2 checkoutBox">
                  <span id="cartPrice" class="px-2 fs-5"></span>
                  <div class="cartOptions">
                    <a class="btn btn-outline-burgundy p-2 mb-1 px-4" id="checkout"><i class="fa-solid fa-cart-shopping"></i> Buy</a>
                    <a class="btn btn-outline-burgundy p-2 mb-1 px-4" id="clearCart"><i class="fa-solid fa-trash"></i> Clear cart</a>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;

  document.body.insertBefore(navbar, document.body.firstChild);
}

createNavbar();

const buyCheckoutButton = () => {
  window.location.href = "./checkout.html";
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("checkout").addEventListener("click", () => {
    buyCheckoutButton();
  });
});

function getScrollAmount() {
  let navbar = document.querySelector(".nb");
  let overlay = document.querySelector(".overlay");
  let scrollAmount = window.scrollY; // or window.pageYOffset

  if (scrollAmount >= 100) {
  } else {
  }
}

// Log it whenever the user scrolls
window.addEventListener("scroll", () => {
  getScrollAmount();
});
