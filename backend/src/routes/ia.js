const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const db = require('../db');
const { autenticarAluno } = require('../middleware/auth');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/perguntar', autenticarAluno, async (req, res) => {
  const { pergunta, modulo } = req.body || {};
  const alunoId = req.aluno.id;

  if (!pergunta) return res.status(400).json({ erro: 'A pergunta é obrigatória' });

  try {
    const aluno = await db.get('SELECT creditos FROM alunos WHERE id = ?', [alunoId]);
    const custoPergunta = 2;
    
    if (aluno.creditos < custoPergunta) {
      return res.status(402).json({ erro: 'Saldo de créditos insuficiente.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: pergunta,
      config: {
        systemInstruction: "És um tutor de contabilidade moçambicano. Explica de forma simples, passo a passo. Não dês a resposta diretamente, guia o aluno. Usa exemplos reais (MZN, mercado local)."
      }
    });

    const respostaIA = response.text;

    await db.transaction(async (client) => {
      await client.query('UPDATE alunos SET creditos = creditos - $1 WHERE id = $2', [custoPergunta, alunoId]);
      await client.query(
        'INSERT INTO logs_ia (aluno_id, modulo, pergunta, resposta, tokens_usados) VALUES ($1, $2, $3, $4, $5)',
        [alunoId, modulo || 'geral', pergunta, respostaIA, 0]
      );
    });

    res.json({ resposta: respostaIA, creditos_restantes: aluno.creditos - custoPergunta });

  } catch (erro) {
    console.error('Erro na IA:', erro.message);
    res.status(500).json({ erro: 'Falha ao comunicar com o tutor de IA.' });
  }
});

module.exports = router;



