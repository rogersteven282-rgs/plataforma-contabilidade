const express = require('express');
const db = require('../db');
const { autenticarAlunoOpcional } = require('../middleware/auth');
const { estadoVisivel, acessoAtivo } = require('../utils/helpers');

const router = express.Router();

// GET /api/config — configuração pública (sem dados sensíveis)
router.get('/config', async (req, res) => {
  const cfg = await db.get('SELECT nome_escola, logo_url, whatsapp_admin, duracao_acesso_dias FROM configuracao WHERE id = 1');
  res.json(cfg);
});

// GET /api/classes — lista todas as classes com o vídeo gratuito de amostra
router.get('/classes', async (req, res) => {
  const classes = await db.all('SELECT id, nome, video_gratuito_url FROM classes ORDER BY id');
  res.json(classes);
});

// GET /api/classes/:id/unidades — unidades ativas de uma classe.
// Se o aluno estiver autenticado (token opcional), inclui o estado do acesso dele a cada unidade.
router.get('/classes/:id/unidades', autenticarAlunoOpcional, async (req, res) => {
  const classeId = Number(req.params.id);
  const unidades = await db.all(
    'SELECT id, classe_id, nome, ordem, preco FROM unidades WHERE classe_id = ? AND ativo = 1 ORDER BY ordem, id',
    [classeId]
  );

  if (!req.aluno) {
    return res.json(unidades.map((u) => ({ ...u, meu_acesso: null })));
  }

  const resultado = await Promise.all(
    unidades.map(async (u) => {
      const acesso = await db.get(
        `SELECT * FROM acessos WHERE aluno_id = ? AND unidade_id = ?
         ORDER BY id DESC LIMIT 1`,
        [req.aluno.id, u.id]
      );
      return {
        ...u,
        meu_acesso: acesso
          ? {
              estado: estadoVisivel(acesso),
              codigo_referencia: acesso.codigo_referencia,
              data_expiracao: acesso.data_expiracao,
            }
          : null,
      };
    })
  );

  res.json(resultado);
});

// GET /api/unidades/:id/temas — lista de temas de uma unidade.
// O link_youtube só é incluído na resposta se o aluno autenticado tiver acesso pago e ativo.
router.get('/unidades/:id/temas', autenticarAlunoOpcional, async (req, res) => {
  const unidadeId = Number(req.params.id);
  const unidade = await db.get('SELECT * FROM unidades WHERE id = ? AND ativo = 1', [unidadeId]);
  if (!unidade) return res.status(404).json({ erro: 'Unidade não encontrada' });

  const temas = await db.all(
    'SELECT id, unidade_id, nome, ordem FROM temas WHERE unidade_id = ? AND ativo = 1 ORDER BY ordem, id',
    [unidadeId]
  );

  let temAcesso = false;
  if (req.aluno) {
    const acesso = await db.get(
      `SELECT * FROM acessos WHERE aluno_id = ? AND unidade_id = ?
       ORDER BY id DESC LIMIT 1`,
      [req.aluno.id, unidadeId]
    );
    temAcesso = acesso ? acessoAtivo(acesso) : false;
  }

  if (!temAcesso) {
    // Nunca inclui link_youtube nem pdf_url no JSON quando não há acesso confirmado e ativo
    return res.json({ unidade: { id: unidade.id, nome: unidade.nome, preco: unidade.preco }, tem_acesso: false, temas: temas.map((t) => ({ id: t.id, nome: t.nome, ordem: t.ordem })) });
  }

  const temasComLink = await db.all(
    'SELECT id, unidade_id, nome, ordem, link_youtube FROM temas WHERE unidade_id = ? AND ativo = 1 ORDER BY ordem, id',
    [unidadeId]
  );

  res.json({
    unidade: { id: unidade.id, nome: unidade.nome, preco: unidade.preco, pdf_url: unidade.pdf_url || null },
    tem_acesso: true,
    temas: temasComLink,
  });
});

module.exports = router;
