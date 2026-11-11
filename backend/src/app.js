const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Rota de Health Check (para o Render não achar que a app morreu)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'Plataforma de Contabilidade IA a correr' });
});

// Rotas do Sistema
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ia', require('./routes/ia'));
app.use('/api/empresa', require('./routes/empresa'));
app.use('/api/pagamentos', require('./routes/pagamentos'));
app.use('/api/ia_publica', require('./routes/ia_publica'));

// Handler global de erros (Segurança: não expõe stack traces ao utilizador)
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;



