const { verificarToken } = require('../utils/auth');

function extrairToken(req) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  if (tipo === 'Bearer' && token) return token;
  return null;
}

function autenticarAluno(req, res, next) {
  const token = extrairToken(req);
  if (!token) return res.status(401).json({ erro: 'Token de aluno em falta' });
  try {
    const payload = verificarToken(token);
    if (payload.tipo !== 'aluno') throw new Error('tipo inválido');
    req.aluno = { id: payload.id, nome: payload.nome };
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token de aluno inválido ou expirado' });
  }
}

// Preenche req.aluno se houver token válido, mas não bloqueia se não houver.
// Usado em rotas públicas que mostram informação extra quando o aluno está autenticado.
function autenticarAlunoOpcional(req, res, next) {
  const token = extrairToken(req);
  if (!token) return next();
  try {
    const payload = verificarToken(token);
    if (payload.tipo === 'aluno') {
      req.aluno = { id: payload.id, nome: payload.nome };
    }
  } catch (e) {
    // token inválido/expirado: segue sem aluno autenticado
  }
  next();
}

function autenticarAdmin(req, res, next) {
  const token = extrairToken(req);
  if (!token) return res.status(401).json({ erro: 'Token de admin em falta' });
  try {
    const payload = verificarToken(token);
    if (payload.tipo !== 'admin') throw new Error('tipo inválido');
    req.admin = { id: payload.id, username: payload.username };
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token de admin inválido ou expirado' });
  }
}

module.exports = { autenticarAluno, autenticarAlunoOpcional, autenticarAdmin };
