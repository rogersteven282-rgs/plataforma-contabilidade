const express = require('express');
const db = require('../db');
const { autenticarAluno } = require('../middleware/auth');

const router = express.Router();

// GET /api/empresa/minha-empresa
router.get('/minha-empresa', autenticarAluno, async (req, res) => {
  try {
    const empresa = await db.get('SELECT * FROM empresa_simulada WHERE aluno_id = ?', [req.aluno.id]);
    if (!empresa) return res.status(404).json({ erro: 'Ainda não criaste a tua empresa.' });
    res.json(empresa);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao procurar empresa.' });
  }
});

// POST /api/empresa/criar
router.post('/criar', autenticarAluno, async (req, res) => {
  const { nome_empresa, tipo_sociedade, capital_social } = req.body;
  if (!nome_empresa || !tipo_sociedade) {
    return res.status(400).json({ erro: 'Nome e tipo de sociedade são obrigatórios.' });
  }
  try {
    const existente = await db.get('SELECT id FROM empresa_simulada WHERE aluno_id = ?', [req.aluno.id]);
    if (existente) return res.status(409).json({ erro: 'Já tens uma empresa criada.' });

    const result = await db.run(
      `INSERT INTO empresa_simulada (aluno_id, nome_empresa, tipo_sociedade, capital_social) 
       VALUES (?, ?, ?, ?) RETURNING id`,
      [req.aluno.id, nome_empresa, tipo_sociedade, capital_social || 0]
    );
    await db.run('UPDATE alunos SET creditos = creditos + 5 WHERE id = ?', [req.aluno.id]);
    res.status(201).json({ mensagem: 'Empresa criada!', empresa_id: result.id });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar a empresa.' });
  }
});
module.exports = router;
