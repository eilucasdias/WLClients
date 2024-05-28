document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const backgroundEmerges = document.getElementById("background-emerges");
  const forgotPassword = document.getElementById("forgot-password");
  const boxForgotPassword = document.getElementById("box-forgot-password");
  const closeIcon = document.getElementById("close-icon");

  function validateInput(input) {
    if (input.value.trim() === "") {
      input.style.border = "1px solid red";
      return false;
    } else {
      input.style.border = "1px solid #ccc";
      return true;
    }
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isUsernameValid = validateInput(username);
    const isPasswordValid = validateInput(password);

    if (isUsernameValid && isPasswordValid) {
      console.log("Login enviado:", {
        username: username.value,
        password: password.value,
      });
      alert("Login enviado!");
      loginForm.reset();
    } else {
      console.log("Preencha todos os campos.");
    }
  });

  forgotPassword.addEventListener("click", () => {
    loginForm.style.transition = "opacity 0.4s ease";
    loginForm.style.opacity = "0";

    setTimeout(() => {
      loginForm.style.display = "none";
      backgroundEmerges.style.display = "block";

      setTimeout(() => {
        backgroundEmerges.classList.add("show");
        boxForgotPassword.classList.add("show");
      }, 100);
    }, 100);
  });

  closeIcon.addEventListener("click", () => {
    boxForgotPassword.classList.remove("show");
    backgroundEmerges.classList.remove("show");

    setTimeout(() => {
      backgroundEmerges.style.display = "none";
      loginForm.style.display = "block";

      setTimeout(() => {
        loginForm.style.opacity = "1";
      }, 100);
    }, 100);
  });
});
