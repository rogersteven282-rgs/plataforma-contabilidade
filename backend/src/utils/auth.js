const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-troque-em-producao';

function hashValor(valor) {
  return bcrypt.hashSync(String(valor), 10);
}

function compararValor(valor, hash) {
  return bcrypt.compareSync(String(valor), hash);
}

function gerarToken(payload, expiresIn = '30d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Gera chave de recuperação no formato: SV-RK-XXXX-XXXX-XXXX
// Alfabeto sem caracteres ambíguos (0/O, 1/I, L)
function gerarChaveRecuperacao() {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bloco = () =>
    Array.from({ length: 4 }, () => alfabeto[crypto.randomInt(0, alfabeto.length)]).join('');
  return `SV-RK-${bloco()}-${bloco()}-${bloco()}`;
}

module.exports = {
  hashValor,
  compararValor,
  gerarToken,
  verificarToken,
  gerarChaveRecuperacao,
  JWT_SECRET,
};