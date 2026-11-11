const express = require('express');
const db = require('../db');
const { autenticarAluno } = require('../middleware/auth');

const router = express.Router();

router.post('/comprar', autenticarAluno, async (req, res) => {
  const { pacote_id } = req.body;
  const alunoId = req.aluno.id;

  // Simulação de lógica de pagamento (M-Pesa / e-Mola)
  const pacotes = {
    1: { creditos: 250, preco: 250 },
    2: { creditos: 560, preco: 500 }, // 500 + 60 bónus
    3: { creditos: 2000, preco: 1000 } // Passe Mensal
  };

  const pacote = pacotes[pacote_id];
  if (!pacote) return res.status(400).json({ erro: 'Pacote inválido' });

  try {
    // AQUI no futuro entrará a integração real com a API do M-Pesa.
    // Por agora, simulamos que o pagamento foi bem-sucedido.
    
    // 1. Registar a transação (tabela de logs)
    await db.run(
      'INSERT INTO logs_ia (aluno_id, modulo, pergunta, resposta) VALUES (?, ?, ?, ?)',
      [alunoId, 'pagamento', `Compra do pacote ${pacote_id}`, `Pagamento simulado de ${pacote.preco} MZN`]
    );

    // 2. Adicionar os créditos ao aluno
    await db.run('UPDATE alunos SET creditos = creditos + ? WHERE id = ?', [pacote.creditos, alunoId]);

    res.json({ ok: true, mensagem: 'Pagamento processado com sucesso.', creditos_adicionados: pacote.creditos });

  } catch (erro) {
    console.error('Erro no pagamento:', erro);
    res.status(500).json({ erro: 'Erro ao processar o pagamento.' });
  }
});

module.exports = router;
