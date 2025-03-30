const product_counter = document.getElementById("product_counter");
product_counter.innerHTML = `<button class="btn btn-outline-dark op" id="addProductButton" data-bs-toggle="modal"
        data-bs-target="#productModal"><i class="fa-solid fa-plus"></i> New</button>`;

const getUserAccount = async () => {
  // GET USER ID FROM LOCALSTORAGE
  const res = JSON.parse(localStorage.getItem("response"));
  const userID = res.userID;
  try {
    const data = await fetch(
      `./scripts/getAccountDetails.php?userID=${userID}`
    );
    const response = await data.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

const renderProductsTable = async () => {
  try {
    const data = await getUserAccount();
    const response = await data;

    if (!Array.isArray(response)) {
      console.error("Response is not an array:", response);
      return; // Stop execution if response is not an array
    }
    console.log(response);

    const tableBody = document.getElementById("accTable");

    tableBody.innerHTML = ""; // Clear the existing table rows

    response.forEach((item, index) => {
      item.splice(0,10).forEach((product, index) => {
        // Render each product row
        tableBody.innerHTML += `
          <tr class="align-middle">
            <td class="py-5 px-4">${index + 1}</td>
            <td class="py-5 px-4"><img src="./uploads/${
              product.image
            }" width="50"></td>
            <td class="py-5 px-4"><a href="./product.html?id=${
              product.product_id
            }">${product.title}</a></td>
            <td class="py-5 px-4">${product.description}</td>
            <td class="py-5 px-4">${product.make}</td>
            <td class="py-5 px-4">${product.model}</td>
            <td class="py-5 px-4">${product.price + "€"}</td>
            <td class="py-5 px-4">
              <a href="?id=${
                product.product_id
              }" class="fw-semibold btn btn-sm btn-outline-danger removes" data-id="${
          product.product_id
        }">
                <i class="fa-solid fa-x"></i>
              </a>
            </td>
          </tr>
        `;
      });
    });
  } catch (error) {
    console.error("Error rendering table:", error);
  }
};

const removeFromProducts = async (productID) => {
  try {
    console.log("Sending DELETE request for product ID:", productID); // Debugging line
    const response = await fetch(
      `./scripts/accountDeleteProduct.php?id=${productID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await response.json();
    console.log("Response from server:", data); // Debugging line

    if (data.status === "success") {
      console.log("Product deleted successfully");
      renderProductsTable(); // Update the UI after deleting the product
    } else {
      alert("Failed to delete product");
    }
  } catch (err) {
    console.log("Error deleting product:", err);
  }
};
renderProductsTable();
