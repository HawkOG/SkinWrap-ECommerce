const handleProductDetails = async (event) => {
  event.preventDefault();
  let alertWrapper = document.getElementById("alertWrapper");

  const savedLogin = JSON.parse(localStorage.getItem("response"));
  if (!savedLogin?.userID || !savedLogin?.username) {
    addAlert("danger", alertWrapper, "You must be logged in to add a listing.");
    return;
  }

  const productTitle = document.getElementById("title").value;
  const productImage = document.getElementById("image").files[0];
  const productDescription = document.getElementById("description").value;
  const productMake = document.getElementById("make").value;
  const productModel = document.getElementById("model").value;
  const productPrice = document.getElementById("price").value;
  const userId = savedLogin.userID;

  const formData = new FormData();
  formData.append("product_id", `SKU-A-${userId}${productPrice}`);
  formData.append("title", productTitle);
  formData.append("image", productImage);
  formData.append("description", productDescription);
  formData.append("make", productMake);
  formData.append("model", productModel);
  formData.append("price", productPrice);
  formData.append("user_id", userId);

  try {
    const response = await fetch("./scripts/handleImage.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      addAlert("danger", alertWrapper, "Failed to add listing");
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === "success") {
      console.log(data);
      addAlert("success", alertWrapper, "Listing added! Please wait.");
      setTimeout(() => {
        hideModalAfterAdding();
        resetInputFields();
        createProductsList();
      }, 3000);
    } else {
      console.error("Error adding product:", data.message);
      addAlert("danger", alertWrapper, "Failed to add listing");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const addAlert = (result, div, text) => {
  const alertElement = document.createElement("div");
  alertElement.className = `alert alert-${result}`;
  alertElement.role = "alert";
  alertElement.innerText = text;

  div.innerHTML = "";
  div.appendChild(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, 3000);
};

const hideModalAfterAdding = () => {
  const modalElement = document.getElementById("productModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  if (modalInstance) {
    modalInstance.hide();
    modalInstance.dispose();
  }

  setTimeout(() => {
    $(".modal-backdrop").remove();
  }, 500);
};

const resetInputFields = () => {
  document.getElementById("title").value = "";
  document.getElementById("image").value = "";
  document.getElementById("description").value = "";
  document.getElementById("make").value = "";
  document.getElementById("model").value = "";
  document.getElementById("price").value = "";
};
