// script.js

function toggleDarkMode() {
    var body = document.body;
    var modeIcon = document.getElementById('mode-icon');
  
    // Alternar a classe 'light-mode' no body
    body.classList.toggle('light-mode');
  
    // Alterar o ícone de acordo com o modo
    if (body.classList.contains('light-mode')) {
      modeIcon.src = 'assets/img/dark.png'; // Ícone para modo escuro
    } else {
      modeIcon.src = 'assets/img/light.png'; // Ícone para modo claro
    }
  }
  