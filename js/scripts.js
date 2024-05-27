document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    let valid = true;

    console.log("Verificando campos...");

    if (username.value.trim() === "") {
      console.log("Campo Usuário vazio.");
      username.style.border = "1px solid red";
      valid = false;
    } else {
      username.style.border = "1px solid #ccc"; // Remover borda vermelha
    }

    if (password.value.trim() === "") {
      console.log("Campo Senha vazio.");
      password.style.border = "1px solid red";
      valid = false;
    } else {
      password.style.border = "1px solid #ccc"; // Remover borda vermelha
    }

    if (valid) {
      console.log("Login enviado:", { username: username.value, password: password.value });
      alert("Login enviado!");
      loginForm.reset();
      username.style.border = "1px solid #ccc"; // Resetar borda após reset do formulário
      password.style.border = "1px solid #ccc"; // Resetar borda após reset do formulário
    } else {
      console.log("Preencha todos os campos.");
    }
  });
});
