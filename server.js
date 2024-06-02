const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Configurar sessão
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Configurar o serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Substitua pelo seu e-mail
    pass: 'your-email-password'    // Substitua pela sua senha
  }
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
      req.session.email = email; // Armazenar o email na sessão
      req.session.isAdmin = results[0].isAdmin; // Armazenar o status de admin na sessão
      res.redirect('/pages/profile.html'); // Redirecionar para a página de perfil
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  });
});

// Configurar rota para obter perfil do usuário
app.get('/profile', (req, res) => {
  const email = req.session.email; // Obter o email da sessão
  if (!email) {
    return res.status(401).send('Usuário não autenticado');
  }
  const sql = 'SELECT nome, email, telefone, endereco FROM usuarios WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao obter perfil do usuário');
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

// Configurar rota para editar perfil do usuário
app.post('/edit-profile', (req, res) => {
  const { nome, email, telefone, endereco, senhaAtual } = req.body;
  const sessionEmail = req.session.email; // Obter o email da sessão

  if (!sessionEmail) {
    return res.status(401).send('Usuário não autenticado');
  }

  // Verificar se a senha atual está correta
  const sqlCheckPassword = 'SELECT senha FROM usuarios WHERE email = ?';
  db.query(sqlCheckPassword, [sessionEmail], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao verificar a senha');
    }
    if (results.length > 0 && results[0].senha === senhaAtual) {
      // Atualizar o perfil do usuário
      const sql = 'UPDATE usuarios SET nome = ?, telefone = ?, endereco = ? WHERE email = ?';
      db.query(sql, [nome, telefone, endereco, sessionEmail], (err, result) => {
        if (err) {
          return res.status(500).send('Erro ao atualizar perfil do usuário');
        }
        res.send('Perfil atualizado com sucesso');
      });
    } else {
      res.status(401).send('Senha atual incorreta');
    }
  });
});

// Configurar rota para logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao encerrar sessão');
    }
    res.redirect('/'); // Redirecionar para a página inicial após logout
  });
});

// Configurar rota para verificar se o usuário é administrador
app.get('/is-admin', (req, res) => {
  const email = req.session.email;
  if (!email) {
    return res.status(401).send('Usuário não autenticado');
  }

  const sql = 'SELECT isAdmin FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao verificar admin');
    }
    if (results.length > 0) {
      res.json({ isAdmin: results[0].isAdmin });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

// Configurar rota para listar todos os usuários (apenas para administradores)
app.get('/admin/users', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Acesso negado');
  }
  const sql = 'SELECT id, nome, email, telefone, endereco FROM usuarios';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao obter usuários');
    }
    res.json(results);
  });
});

// Configurar rota para editar usuário (apenas para administradores)
app.post('/admin/edit-user', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Acesso negado');
  }

  const { id, nome, email, telefone, endereco } = req.body;
  const sql = 'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?';

  db.query(sql, [nome, email, telefone, endereco, id], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao atualizar usuário');
    }
    res.send('Usuário atualizado com sucesso');
  });
});

// Configurar rota para excluir usuário (apenas para administradores)
app.delete('/admin/users/:id', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Acesso negado');
  }
  const id = req.params.id;
  const sql = 'DELETE FROM usuarios WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao excluir usuário');
    }
    res.send('Usuário excluído com sucesso');
  });
});

// Configurar rota para obter dados de um único usuário por email (apenas para administradores)
app.get('/admin/users/:email', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Acesso negado');
  }

  const email = req.params.email;
  const sql = 'SELECT id, nome, email, telefone, endereco FROM usuarios WHERE email = ?';

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao obter dados do usuário');
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

// Configurar rota para obter dados de um único usuário por ID (apenas para administradores)
app.get('/admin/users/:id', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).send('Acesso negado');
  }

  const id = req.params.id;
  const sql = 'SELECT id, nome, email, telefone, endereco FROM usuarios WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao obter dados do usuário');
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

// Configurar rota para solicitar redefinição de senha
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (results.length === 0) return res.status(404).send('Usuário não encontrado');

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora
    const updateSql = 'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?';
    db.query(updateSql, [token, expires, email], (err, result) => {
      if (err) return res.status(500).send('Erro ao definir o token');

      const mailOptions = {
        to: email,
        from: 'your-email@gmail.com',
        subject: 'Redefinição de Senha',
        text: `Você está recebendo isso porque você (ou alguém mais) solicitou a redefinição da senha da sua conta.\n\n` +
              `Por favor, clique no link a seguir, ou cole-o no seu navegador para completar o processo:\n\n` +
              `http://${req.headers.host}/reset-password/${token}\n\n` +
              `Se você não solicitou isso, por favor ignore este e-mail e sua senha permanecerá inalterada.\n`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send('Erro ao enviar e-mail');
        res.status(200).send({ success: true, message: 'E-mail de redefinição de senha enviado' });
      });
    });
  });
});

// Rota para verificar o token e redefinir a senha
app.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const sql = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
  db.query(sql, [token, Date.now()], (err, results) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (results.length === 0) return res.status(400).send('Token inválido ou expirado');

    res.redirect(`/pages/reset-password.html?token=${token}`);
  });
});

app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
  db.query(sql, [token, Date.now()], (err, results) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (results.length === 0) return res.status(400).send('Token inválido ou expirado');

    const updateSql = 'UPDATE usuarios SET senha = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken = ?';
    db.query(updateSql, [newPassword, token], (err, result) => {
      if (err) return res.status(500).send('Erro ao redefinir a senha');
      res.status(200).send({ success: true, message: 'Senha redefinida com sucesso' });
    });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
