let loginButton = document.getElementById("loginButton");
let userLoggedIn = false;
let userArea = document.getElementById("userArea");
const email = document.querySelector(".email");
const pwChecker = document.querySelector(".pwChecker");
const password = document.querySelector(".password");
let username = document.querySelector(".username");
const passwordRepeat = document.querySelector(".passwordRepeat");

pwChecker.style.display = "none";
password.addEventListener("input", registerCheckPasswords);
passwordRepeat.addEventListener("input", registerCheckPasswords);

function registerCheckPasswords() {
  if (password.value !== passwordRepeat.value) {
    pwChecker.style.display = "block";
    return false;
  } else {
    pwChecker.style.display = "none";
    return [email.value, username.value, password.value];
  }
}

document
  .getElementById("registerAccount")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = registerCheckPasswords();
    if (!data) return;

    try {
      const response = await fetch("./scripts/createAccount.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data[0],
          username: data[1],
          password: data[2],
        }),
      });

      const responseData = await response.json();
      console.log("Server Response:", responseData);
      const throwAccountCreateSuccess = document.getElementById(
        "accountCreatedAlert"
      );

      throwAccountCreateSuccess.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Account created!</strong> You can log in now!
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  });

const appendUserMenu = (user) => {
  userArea.innerHTML = `
      <div class="dropdown">
        <button class="btn dropdown-toggle text-light" type="button" id="userAccMenu" data-bs-toggle="dropdown" aria-expanded="false">
        ${user}
        </button>
        <ul class="dropdown-menu dropdown-menu-light p-2" aria-labelledby="userAccMenu">
          <a href="./myaccount.html?user=${user}" class="dropdown-item"><i class="fa-solid fa-user"></i> · My Account</a>
          <li class="dropdown-item" id="logoutButton"><i class="fa-solid fa-door-open"></i> · Logout</li>
        </ul>
      </div>
    `;
  // Attach logout event listener
  document.getElementById("logoutButton").addEventListener("click", userLogout);
};

const checkLogin = () => {
  const savedLogin = JSON.parse(localStorage.getItem("response"));
  if (savedLogin && savedLogin.userID) {
    userLoggedIn = true;
    appendUserMenu(savedLogin.username);
  } else {
    userLoggedIn = false;
    showLoginButton();
  }
};
const showLoginButton = () => {
  userArea.innerHTML = `
    <button class="op btn text-light" id="loginButton" data-bs-toggle="modal" data-bs-target="#myModal">Login/Register</button>
  `;

  // Re-add event listener for opening login modal
  document.getElementById("loginButton").addEventListener("click", showModal);
};
async function userLogIn(e) {
  e.preventDefault();
  const email = document.querySelector(".loginEmail").value;
  const password = document.querySelector(".loginPassword").value;

  try {
    const response = await fetch("./scripts/userLogIn.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error(response.status);

    const json = await response.json();
    if (json.username && json.user_id) {
      userLoggedIn = true;

      // Save user data in localStorage
      localStorage.setItem(
        "response",
        JSON.stringify({
          userID: json.user_id,
          username: json.username,
        })
      );

      // Close the modal
      const modalElement = document.getElementById("myModal");
      let existingModal = bootstrap.Modal.getInstance(modalElement);
      if (existingModal) {
        existingModal.hide();
      }

      // Update UI
      appendUserMenu();
      setTimeout(() => appendUserMenu(json.username), 500);
      showAlert(`User ${json.username} successfully logged in`, "custom");

      return json; // Return login data for further use
    } else {
      console.error("Invalid login response:", json);
    }
  } catch (error) {
    console.error("Login error:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", checkLogin);

const userLogout = () => {
  localStorage.removeItem("response");
  userLoggedIn = false;
  showLoginButton();
  window.location.href = "./";
};

// Function to show modal
function showModal() {
  let modalElement = document.getElementById("myModal");
  if (!modalElement) {
    console.error("Modal not found!");
    return;
  }

  let myModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  myModal.show();
}

const handleAddProductModal = () => {
  let modalElement = document.getElementById("addProduct");
  if (!modalElement) {
    console.error("Modal not found!");
    return;
  }
  let myModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  myModal.show();
};
