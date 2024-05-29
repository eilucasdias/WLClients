document.addEventListener("DOMContentLoaded", () => {
  function openModal(profissional) {
    const modal = document.getElementById("modal-compra");
    const paymentMethod = document.getElementById("payment-method");
    const pixFields = document.getElementById("pix-fields");

    modal.style.display = "block";
    paymentMethod.value = ""; // Resetar a seleção de método de pagamento
    pixFields.style.display = "none"; // Garante que os campos de PIX não sejam exibidos ao abrir o modal
  }

  function closeModal() {
    const modal = document.getElementById("modal-compra");
    modal.style.display = "none";
  }

  function togglePaymentFields() {
    const paymentMethod = document.getElementById("payment-method").value;
    const pixFields = document.getElementById("pix-fields");

    pixFields.style.display = "none"; // Esconde o campo de PIX por padrão

    if (paymentMethod === "pix") {
      pixFields.style.display = "block"; // Mostra o campo de PIX quando selecionado
    }
  }

  // Expondo as funções de abrir e fechar modal globalmente
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.togglePaymentFields = togglePaymentFields;
});
