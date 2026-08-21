import { adminLogin } from "../api/adminApi.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  errorMessage.textContent = "";

  if (!username || !password) {
    errorMessage.textContent = "Please enter your username and password.";
    return;
  }

  try {
    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    await adminLogin(username, password);

    // Authentication succeeded.
    window.location.href = "/admin/dashboard.html";

  } catch (error) {
    console.error("Login error:", error);

    errorMessage.textContent =
      error.message || "Unable to sign in. Please try again.";

  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
  }
});