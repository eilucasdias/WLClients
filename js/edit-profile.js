document.addEventListener('DOMContentLoaded', function() {
    // Carregar informações do perfil do usuário
    fetch('/profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('nome').value = data.nome;
            document.getElementById('email').value = data.email;
            document.getElementById('telefone').value = data.telefone;
            document.getElementById('endereco').value = data.endereco;
        })
        .catch(error => console.error('Erro ao carregar perfil:', error));

    // Salvar alterações no perfil do usuário
    document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;
        const senhaAtual = document.getElementById('senhaAtual').value; // Nova senha atual

        fetch('/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, telefone, endereco, senhaAtual }) // Incluir senha atual
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            window.location.href = 'profile.html';
        })
        .catch(error => console.error('Erro:', error));
    });
});
