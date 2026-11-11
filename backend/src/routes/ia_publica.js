const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const db = require('../db');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/perguntar-publico', async (req, res) => {
  const { pergunta } = req.body || {};
  if (!pergunta) return res.status(400).json({ erro: 'A pergunta é obrigatória' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: pergunta,
      config: {
        systemInstruction: "És um professor de contabilidade muito amigável para alunos do ensino secundário em Moçambique. Explica conceitos de forma muito simples, usando exemplos do dia a dia (lojas, mercado, dinheiro da escola). Não uses termos técnicos pesados. Sê encorajador e mostra que a contabilidade é fácil."
      }
    });

    // Gravar o log (sem aluno_id, pois é público)
    await db.run(
      'INSERT INTO logs_ia (modulo, pergunta, resposta) VALUES (?, ?, ?)',
      ['publico_secundario', pergunta, response.text]
    );

    res.json({ resposta: response.text });
  } catch (erro) {
    console.error('Erro na IA Pública:', erro.message);
    res.status(500).json({ erro: 'Falha ao comunicar com o tutor.' });
  }
});

module.exports = router;
