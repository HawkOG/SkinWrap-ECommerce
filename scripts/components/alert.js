const showAlert = (text, type) => {
  const alert = document.createElement("div");
  alert.className = `alert_dynamic bg-${type}`; // e.g., alert-warning
  alert.innerHTML = text;

  document.body.appendChild(alert);

  alert.style.transition = "opacity 500ms";
  alert.style.opacity = 0;

  // Initially hidden with opacity 0 and visibility hidden
  setTimeout(() => {
    alert.style.opacity = 1;
  }, 500);

  setTimeout(() => {
    alert.style.opacity = 0; // This will fade the alert out
  }, 4000);

  setTimeout(() => {
    alert.remove();
  }, 5000);
};
