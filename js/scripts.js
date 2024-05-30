document.addEventListener("DOMContentLoaded", () => {
  let paypalButtonsRendered = false;

  function openModal(profissional) {
    const modal = document.getElementById("modal-compra");
    modal.style.display = "block";
    resetPaymentFields();
  }

  function closeModal() {
    const modal = document.getElementById("modal-compra");
    modal.style.display = "none";
  }

  function resetPaymentFields() {
    const pixFields = document.getElementById("pix-fields");
    const paypalContainer = document.getElementById("paypal-button-container");

    if (pixFields) pixFields.style.display = "none";
    if (paypalContainer) paypalContainer.style.display = "none";
  }

  function showPixQRCode() {
    resetPaymentFields();
    const pixFields = document.getElementById("pix-fields");
    if (pixFields) pixFields.style.display = "block";
  }

  function selectPaymentMethod(method) {
    resetPaymentFields();

    if (method === "pix") {
      document.getElementById("pix-fields").style.display = "block";
    } else if (method === "credit" || method === "debit") {
      const paypalContainer = document.getElementById("paypal-button-container");
      paypalContainer.style.display = "block";

      if (!paypalButtonsRendered) {
        // Renderiza o botão do PayPal uma vez
        paypal.Buttons({
          createOrder: function (data, actions) {
            const rankingSelect = document.querySelector('select[name="ranking"]');
            const selectedOption = rankingSelect.options[rankingSelect.selectedIndex].text;
            const amount = parseFloat(selectedOption.match(/R\$ ([0-9,]+).*/)[1].replace(",", "."));

            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount.toFixed(2) // Total do cliente
                },
                description: `Pagamento para ${rankingSelect.name}, ${selectedOption}`
              }]
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              alert('Transação concluída por ' + details.payer.name.given_name);

              closeModal();
            });
          }
        }).render('#paypal-button-container');
        paypalButtonsRendered = true;
      }
    }
  }

  // Impedir o fechamento do modal ao clicar nos botões de pagamento
  document.querySelectorAll('.payment-button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });

  // Função para alternar entre modo claro e escuro
  const modeToggle = document.querySelector('.mode-toggle');
  const body = document.body;

  modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
  });

  // Expondo as funções de abrir e fechar modal globalmente
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.selectPaymentMethod = selectPaymentMethod;
  window.showPixQRCode = showPixQRCode;
});
