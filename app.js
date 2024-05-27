const express = require('express');
const path = require('path');
const app = express();
const port = 2464;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Adicionar rota para servir a pasta 'pages'
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
