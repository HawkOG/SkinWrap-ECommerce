const productWrapper = document.querySelector(".productWrapper");
const getAllProducts = async () => {
  try {
    const data = await fetch("./scripts/getAllProducts.php");
    const response = await data.json();
    console.log(response);
    createProductsList(response);
  } catch (error) {
    console.log(error);
  }
};
document.addEventListener("DOMContentLoaded", getAllProducts);
