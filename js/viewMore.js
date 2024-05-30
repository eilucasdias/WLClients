// Função para adicionar mais itens quando clicar em "Ver Mais"
function verMais() {
    var produtosAdicionais = document.querySelector('.produtos-adicionais');
    produtosAdicionais.style.display = 'flex'; // Mostra os itens adicionais
  
    var containerPrincipal = document.getElementById('produtos');
    var itensAdicionais = document.querySelectorAll('.produtos-adicionais .produto-item');
  
    // Adiciona cada item adicional ao container principal, garantindo que fiquem em linhas de quatro
    var count = 0;
    var row = document.createElement('div');
    row.classList.add('produtos-flex');
    containerPrincipal.appendChild(row);
  
    itensAdicionais.forEach(function(item) {
      var cloneItem = item.cloneNode(true);
      row.appendChild(cloneItem);
      count++;
      if (count % 4 === 0) {
        row = document.createElement('div');
        row.classList.add('produtos-flex');
        containerPrincipal.appendChild(row);
      }
    });
  }
  
  // Adicionando um ouvinte de evento ao botão "Ver Mais"
  document.getElementById('verMaisBtn').addEventListener('click', verMais);
  