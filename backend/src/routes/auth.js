const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/auth/registo-aluno
router.post('/registo-aluno', async (req, res) => {
  const { nome, whatsapp, pin } = req.body;
  if (!nome || !whatsapp || !pin) return res.status(400).json({ erro: 'Dados incompletos' });
  if (!/^\d{4}$/.test(String(pin))) return res.status(400).json({ erro: 'PIN deve ter 4 dígitos' });

  try {
    const existente = await db.get('SELECT id FROM alunos WHERE whatsapp = ?', [whatsapp]);
    if (existente) return res.status(409).json({ erro: 'WhatsApp já registado' });

    const pinHash = await bcrypt.hash(String(pin), 10);
    // Dá 10 créditos de bónus ao registar
    const result = await db.run(
      'INSERT INTO alunos (nome, whatsapp, pin_hash, creditos) VALUES (?, ?, ?, 10) RETURNING id', 
      [nome, whatsapp, pinHash]
    );

    const token = jwt.sign({ id: result.id, tipo: 'aluno' }, process.env.JWT_SECRET || 'segredo-dev', { expiresIn: '7d' });
    res.status(201).json({ token, aluno: { id: result.id, nome, whatsapp, creditos: 10 } });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { whatsapp, pin } = req.body;
  try {
    const aluno = await db.get('SELECT * FROM alunos WHERE whatsapp = ?', [whatsapp]);
    if (!aluno || !(await bcrypt.compare(String(pin), aluno.pin_hash))) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: aluno.id, tipo: 'aluno' }, process.env.JWT_SECRET || 'segredo-dev', { expiresIn: '7d' });
    res.json({ token, aluno: { id: aluno.id, nome: aluno.nome, whatsapp: aluno.whatsapp, creditos: aluno.creditos } });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;
