document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada!');

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Login enviado:', { username, password });

        // Aqui você pode adicionar a lógica para verificar o login com seu servidor

        alert('Login enviado!');
        loginForm.reset();
    });

    window.onSignIn = function(googleUser) {
        const profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Nome: ' + profile.getName());
        console.log('URL da Imagem: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        // Aqui você pode enviar os dados do usuário para o seu servidor

        alert('Login com Google realizado com sucesso!');
    };

    const forgotPasswordLink = document.getElementById('forgot-password');
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();

        // Solicitar o e-mail do usuário
        const email = prompt('Por favor, insira seu e-mail para recuperação de senha:');

        if (email) {
            // Aqui você pode adicionar a lógica para enviar o e-mail de recuperação
            console.log('E-mail de recuperação enviado para:', email);
            alert('Se um e-mail válido foi inserido, um link de recuperação de senha foi enviado.');
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });
});
