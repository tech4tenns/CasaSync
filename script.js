
localStorage.removeItem("casasyncNome");

    // Mostrar / ocultar senha
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    togglePassword.addEventListener("click", function () {

      if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
      } else {
        password.type = "password";
        togglePassword.textContent = "👁️";
      }

    });


    // Validação do formulário
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function(event) {

      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("password").value.trim();

      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");
      const successMessage = document.getElementById("successMessage");

      let valido = true;

      emailError.style.display = "none";
      passwordError.style.display = "none";
      successMessage.style.display = "none";


      // Validação do e-mail
      const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailValido) {
        emailError.style.display = "block";
        valido = false;
      }


      // Validação da senha
      if (senha.length < 6) {
        passwordError.style.display = "block";
        valido = false;
      }


      // Login aprovado
      if (valido) {

        successMessage.style.display = "block";

        console.log("E-mail:", email);
        console.log("Lembrar de mim:",
          document.getElementById("remember").checked
        );

      }

    });


    // Login com Google
    function googleLogin() {
      alert("Login com Google será conectado aqui!");
    }

    function fazerLogin() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (email === "" && senha === "") {
        alert("⚠️ Por favor, coloque o e-mail e a senha.");
        return;
    }

    if (email === "") {
        alert("📧 Por favor, coloque o e-mail.");
        return;
    }

    if (senha === "") {
        alert("🔒 Por favor, coloque a senha.");
        return;
    }

    // Se estiver tudo preenchido, vai para a Home
    window.location.href = "home.html";
}