document.addEventListener("DOMContentLoaded", () => {
  let paypalButtonsRendered = false;

  // Função para abrir o modal de pagamento
  function openModal(profissional) {
    const modalCompra = document.getElementById("modal-compra");
    modalCompra.style.display = "block";
    resetPaymentFields();
  }

  // Função para fechar a tela de login
  function remove() {
    const backgroundLogin = document.getElementById("background-login");
    const loginContainer = document.querySelector(".login-container");
    loginContainer.style.display = "none";
    backgroundLogin.style.display = "none";
  }

  // Função para abrir a tela de login
  function openLogin() {
    const backgroundLogin = document.getElementById("background-login");
    const loginContainer = document.querySelector(".login-container");
    loginContainer.style.display = "flex";
    backgroundLogin.style.display = "flex";
  }

  // Função para fechar a tela de login
  function fechar() {
    const backgroundLogin = document.querySelector(".background-login");
    const loginContainer = document.querySelector(".login-container");
    const modalCompra = document.querySelector("#modal-compra");
    modalCompra.style.display = "none"
    backgroundLogin.style.display = "none";
    loginContainer.style.display = "none";
    const modalProfile = document.querySelector("#modal-profile");
    modalProfile.style.display = "none"
    
  }
  // Função para fechar o modal de pagamento
  function closeModal() {
    const backgroundLogin = document.getElementById("background-login");
    backgroundLogin.style.display = "none";
  }

  // Função para resetar os campos de pagamento
  function resetPaymentFields() {
    const pixFields = document.getElementById("pix-fields");
    const paypalContainer = document.getElementById("paypal-button-container");

    if (pixFields) pixFields.style.display = "none";
    if (paypalContainer) paypalContainer.style.display = "none";
  }

  // Função para mostrar o QR Code do PIX
  function showPixQRCode() {
    resetPaymentFields();
    const pixFields = document.getElementById("pix-fields");
    if (pixFields) pixFields.style.display = "block";
  }

  // Função para selecionar o método de pagamento
  function selectPaymentMethod(method) {
    resetPaymentFields();

    if (method === "pix") {
      document.getElementById("pix-fields").style.display = "block";
    } else if (method === "credit" || method === "debit") {
      const paypalContainer = document.getElementById("paypal-button-container");
      paypalContainer.style.display = "block";

      if (!paypalButtonsRendered) {
        // Renderiza o botão do PayPal uma vez
        paypal
          .Buttons({
            createOrder: function (data, actions) {
              const rankingSelect = document.querySelector('select[name="ranking"]');
              const selectedOption = rankingSelect.options[rankingSelect.selectedIndex].text;
              const amount = parseFloat(selectedOption.match(/R\$ ([0-9,]+).*/)[1].replace(",", "."));

              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toFixed(2), // Total do cliente
                    },
                    description: `Pagamento para ${rankingSelect.name}, ${selectedOption}`,
                  },
                ],
              });
            },
            onApprove: function (data, actions) {
              return actions.order.capture().then(function (details) {
                alert("Transação concluída por " + details.payer.name.given_name);
                closeModal();
              });
            },
          })
          .render("#paypal-button-container");
        paypalButtonsRendered = true;
      }
    }
  }

  // Impedir o fechamento do modal ao clicar nos botões de pagamento
  document.querySelectorAll(".payment-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  // Função para abrir o modal de perfil do profissional
  function openProfileModal(professionalName) {
    // Carregar as informações do profissional
    const profileDetails = document.getElementById("profile-details");
    profileDetails.innerHTML = `
      <p>Plataforma que joga: PC</p>
      <p>Membro desde: 01/01/2023</p>
      <p>Contas jogadas até o momento: 1000 contas</p>
      <p>Último acesso: 29/05/2024</p>
    `;

    // Abrir o modal
    const modalProfile = document.getElementById("modal-profile");
    modalProfile.style.display = "block";

    // Configurar estrelas clicáveis
    const stars = document.querySelectorAll("#rating-stars .fa-star");
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = this.getAttribute("data-rating");
        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add("filled");
          } else {
            s.classList.remove("filled");
          }
        });
      });
    });
  }

  // Função para fechar o modal de perfil do profissional


  // Função para abrir o modal de contratação
  function openHireModal() {
    const modalCompra = document.getElementById("modal-compra");
    modalCompra.style.display = "block";
  }

  // Função para enviar uma avaliação
  function submitReview() {
    const comment = document.getElementById("review-comment").value;
    const rating = document.querySelectorAll("#rating-stars .fa-star.filled").length;
    const clientName = "Nome do Cliente"; // Pode ser recuperado de um campo de login, por exemplo

    const newReview = `
      <div class="review">
        <p><strong>Comentário:</strong> ${comment}</p>
        <div class="stars">
          ${'<i class="fa fa-star filled"></i>'.repeat(rating)}
          ${'<i class="fa fa-star"></i>'.repeat(5 - rating)}
        </div>
        <p class="review-date">Comentário realizado pelo cliente em ${new Date().toLocaleString()}</p>
      </div>
    `;

    document.querySelector("#client-reviews").insertAdjacentHTML("beforeend", newReview);
    document.getElementById("review-comment").value = "";
    document.querySelectorAll("#rating-stars .fa-star").forEach((star) => star.classList.remove("filled"));
  }

  // Função para exibir/ocultar comentários
  function toggleComments() {
    const clientReviews = document.getElementById("client-reviews");
    const toggleButton = document.querySelector(".toggle-comments-button");
    if (clientReviews.style.display === "none" || clientReviews.style.display === "") {
      clientReviews.style.display = "block";
      toggleButton.textContent = "Ocultar Comentários";
    } else {
      clientReviews.style.display = "none";
      toggleButton.textContent = "Exibir Comentários";
    }
  }

  // Função para curtir um comentário
  function likeReview(element) {
    const likeCount = element.querySelector(".like-count");
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
  }

  // Função para não curtir um comentário
  function dislikeReview(element) {
    const dislikeCount = element.querySelector(".dislike-count");
    dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
  }

  // Expondo as funções de abrir e fechar modal globalmente
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.selectPaymentMethod = selectPaymentMethod;
  window.showPixQRCode = showPixQRCode;
  window.openLogin = openLogin;
  window.fechar = fechar;
  window.remove = remove;
  window.openProfileModal = openProfileModal;
  window.openHireModal = openHireModal;
  window.submitReview = submitReview;
  window.toggleComments = toggleComments;
  window.likeReview = likeReview;
  window.dislikeReview = dislikeReview;
  
  // Validação das senhas no formulário de criação de conta
  const form = document.getElementById("create-account-form");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", (event) => {
    if (senhaInput.value !== confirmarSenhaInput.value) {
      event.preventDefault();
      errorMessage.textContent = "As senhas não coincidem. Por favor, verifique.";
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
    }
  });

  // Função para abrir o modal de esqueci a senha
  function openForgotPasswordModal() {
    const modal = document.getElementById("box-forgot-password");
    modal.style.display = "block";
    document.getElementById("background-emerges").style.display = "block";
  }

  // Função para abrir o modal de redefinição de senha
  function openResetPasswordModal() {
    const modal = document.getElementById("box-reset-password");
    modal.style.display = "block";
    document.getElementById("background-emerges").style.display = "block";
  }

  // Função para fechar todos os modais de esqueci/redefinição de senha
  function closePasswordModals() {
    document.getElementById("box-forgot-password").style.display = "none";
    document.getElementById("box-reset-password").style.display = "none";
    document.getElementById("background-emerges").style.display = "none";
  }

  // Adicionar evento para o link de esqueci a senha
  document.getElementById("forgot-password").addEventListener("click", openForgotPasswordModal);
  document.querySelectorAll("#close-icon").forEach(icon => icon.addEventListener("click", closePasswordModals));

  // Enviar código de redefinição de senha
  document.getElementById("forgot-password-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("reset-email").value;

    fetch('/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Código enviado para o email fornecido');
        closePasswordModals();
        openResetPasswordModal();
      } else {
        alert('Erro ao enviar código');
      }
    })
    .catch(error => console.error('Erro ao enviar código:', error));
  });

  // Redefinir senha
  document.getElementById("reset-password-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const code = document.getElementById("reset-code").value;
    const newPassword = document.getElementById("new-password").value;

    fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, newPassword })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Senha redefinida com sucesso');
        closePasswordModals();
      } else {
        alert('Erro ao redefinir senha');
      }
    })
    .catch(error => console.error('Erro ao redefinir senha:', error));
  });
});
