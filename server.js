const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurar o body-parser para analisar os dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!Sql@developer10',  // Substitua pela sua senha do MySQL
  database: 'wlclients'
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Configurar rota para registrar usuário
app.post('/register', (req, res) => {
  const { nome, email, telefone, cep, endereco, bairro, cidade, estado, complemento, numero, dataNascimento, senha } = req.body;
  const sql = 'INSERT INTO usuarios (nome, email, telefone, cep, endereco, bairro, cidade, estado, complemento, numero, data_nascimento, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [nome, email, telefone, cep, endereco, bairro, cidade, estado, complemento, numero, dataNascimento, senha], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao registrar usuário');
    }
    res.send('Usuário registrado com sucesso');
  });
});

// Configurar rota para autenticar usuário
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao autenticar usuário');
    }
    if (results.length > 0) {
      res.send('Usuário autenticado com sucesso');
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
