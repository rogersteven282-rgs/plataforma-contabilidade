const express = require('express');
const db = require('../db');
const { hashValor, compararValor, gerarToken } = require('../utils/auth');
const { autenticarAdmin } = require('../middleware/auth');
const { hojeISO, adicionarDias, estadoVisivel } = require('../utils/helpers');

const router = express.Router();

// ---------- Login ----------

// POST /api/admin/login — { username, password }
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ erro: 'username e password são obrigatórios' });

  const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
  if (!admin || !compararValor(password, admin.password_hash)) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = gerarToken({ tipo: 'admin', id: admin.id, username: admin.username });
  res.json({ token, admin: { id: admin.id, username: admin.username } });
});

// A partir daqui, todas as rotas exigem admin autenticado
router.use(autenticarAdmin);

// PUT /api/admin/me — trocar username e/ou password do admin autenticado
router.put('/me', async (req, res) => {
  const { passwordAtual, novoUsername, novaPassword } = req.body || {};
  if (!passwordAtual) {
    return res.status(400).json({ erro: 'A password atual é obrigatória' });
  }

  const admin = await db.get('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
  if (!admin || !compararValor(passwordAtual, admin.password_hash)) {
    return res.status(401).json({ erro: 'Password atual incorreta' });
  }

  if (novaPassword && novaPassword.length < 4) {
    return res.status(400).json({ erro: 'A nova password deve ter pelo menos 4 caracteres' });
  }

  const usernameFinal = novoUsername && novoUsername.trim() ? novoUsername.trim() : admin.username;

  if (usernameFinal !== admin.username) {
    const existente = await db.get('SELECT id FROM admins WHERE username = ? AND id != ?', [usernameFinal, admin.id]);
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um admin com esse username' });
    }
  }

  const hashFinal = novaPassword ? hashValor(novaPassword) : admin.password_hash;

  await db.run('UPDATE admins SET username = ?, password_hash = ? WHERE id = ?', [usernameFinal, hashFinal, admin.id]);

  res.json({ ok: true, admin: { id: admin.id, username: usernameFinal } });
});

// ---------- Classes (CRUD) ----------

router.get('/classes', async (req, res) => {
  res.json(await db.all('SELECT * FROM classes ORDER BY id'));
});

router.post('/classes', async (req, res) => {
  const { nome, video_gratuito_url } = req.body || {};
  if (!nome) return res.status(400).json({ erro: 'nome é obrigatório' });
  const info = await db.run('INSERT INTO classes (nome, video_gratuito_url) VALUES (?, ?) RETURNING id', [nome, video_gratuito_url || null]);
  res.status(201).json(await db.get('SELECT * FROM classes WHERE id = ?', [info.id]));
});

router.put('/classes/:id', async (req, res) => {
  const { nome, video_gratuito_url } = req.body || {};
  const existente = await db.get('SELECT * FROM classes WHERE id = ?', [req.params.id]);
  if (!existente) return res.status(404).json({ erro: 'Classe não encontrada' });
  await db.run('UPDATE classes SET nome = ?, video_gratuito_url = ? WHERE id = ?', [
    nome ?? existente.nome,
    // Usa "!== undefined" (em vez de "??") para que enviar null/"" limpe mesmo o link —
    // com "??", null era tratado como "não enviado" e o link antigo nunca era apagado.
    video_gratuito_url !== undefined ? video_gratuito_url : existente.video_gratuito_url,
    req.params.id,
  ]);
  res.json(await db.get('SELECT * FROM classes WHERE id = ?', [req.params.id]));
});

router.delete('/classes/:id', async (req, res) => {
  await db.run('DELETE FROM classes WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

// ---------- Unidades (CRUD + reordenar + ativar/desativar) ----------

router.get('/unidades', async (req, res) => {
  const { classe_id } = req.query;
  if (classe_id) {
    return res.json(await db.all('SELECT * FROM unidades WHERE classe_id = ? ORDER BY ordem, id', [classe_id]));
  }
  res.json(await db.all('SELECT * FROM unidades ORDER BY classe_id, ordem, id'));
});

router.post('/unidades', async (req, res) => {
  const { classe_id, nome, ordem, preco, ativo, pdf_url } = req.body || {};
  if (!classe_id || !nome) return res.status(400).json({ erro: 'classe_id e nome são obrigatórios' });
  const info = await db.run(
    'INSERT INTO unidades (classe_id, nome, ordem, preco, ativo, pdf_url) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
    [classe_id, nome, ordem ?? 0, preco ?? 0, ativo === false ? 0 : 1, pdf_url || null]
  );
  res.status(201).json(await db.get('SELECT * FROM unidades WHERE id = ?', [info.id]));
});

router.put('/unidades/:id', async (req, res) => {
  const existente = await db.get('SELECT * FROM unidades WHERE id = ?', [req.params.id]);
  if (!existente) return res.status(404).json({ erro: 'Unidade não encontrada' });
  const { nome, ordem, preco, ativo, classe_id, pdf_url } = req.body || {};
  await db.run('UPDATE unidades SET classe_id = ?, nome = ?, ordem = ?, preco = ?, ativo = ?, pdf_url = ? WHERE id = ?', [
    classe_id ?? existente.classe_id,
    nome ?? existente.nome,
    ordem ?? existente.ordem,
    preco ?? existente.preco,
    ativo === undefined ? existente.ativo : (ativo ? 1 : 0),
    // "!== undefined" (não "??") para que apagar o PDF (enviar null) seja mesmo gravado
    pdf_url !== undefined ? pdf_url : existente.pdf_url,
    req.params.id,
  ]);
  res.json(await db.get('SELECT * FROM unidades WHERE id = ?', [req.params.id]));
});

router.delete('/unidades/:id', async (req, res) => {
  await db.run('DELETE FROM unidades WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

// POST /api/admin/unidades/reordenar — { ids: [3, 1, 2] } define a nova ordem (índice na lista = campo ordem)
router.post('/unidades/reordenar', async (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) return res.status(400).json({ erro: 'ids deve ser um array' });
  await db.transaction(async (client) => {
    for (let idx = 0; idx < ids.length; idx += 1) {
      await client.query('UPDATE unidades SET ordem = $1 WHERE id = $2', [idx, ids[idx]]);
    }
  });
  res.json({ ok: true });
});

// ---------- Temas (CRUD + reordenar) ----------

router.get('/temas', async (req, res) => {
  const { unidade_id } = req.query;
  if (unidade_id) {
    return res.json(await db.all('SELECT * FROM temas WHERE unidade_id = ? ORDER BY ordem, id', [unidade_id]));
  }
  res.json(await db.all('SELECT * FROM temas ORDER BY unidade_id, ordem, id'));
});

router.post('/temas', async (req, res) => {
  const { unidade_id, nome, ordem, link_youtube, ativo } = req.body || {};
  if (!unidade_id || !nome) return res.status(400).json({ erro: 'unidade_id e nome são obrigatórios' });
  const info = await db.run(
    'INSERT INTO temas (unidade_id, nome, ordem, link_youtube, ativo) VALUES (?, ?, ?, ?, ?) RETURNING id',
    [unidade_id, nome, ordem ?? 0, link_youtube || null, ativo === false ? 0 : 1]
  );
  res.status(201).json(await db.get('SELECT * FROM temas WHERE id = ?', [info.id]));
});

router.put('/temas/:id', async (req, res) => {
  const existente = await db.get('SELECT * FROM temas WHERE id = ?', [req.params.id]);
  if (!existente) return res.status(404).json({ erro: 'Tema não encontrado' });
  const { nome, ordem, link_youtube, ativo, unidade_id } = req.body || {};
  await db.run('UPDATE temas SET unidade_id = ?, nome = ?, ordem = ?, link_youtube = ?, ativo = ? WHERE id = ?', [
    unidade_id ?? existente.unidade_id,
    nome ?? existente.nome,
    ordem ?? existente.ordem,
    link_youtube !== undefined ? link_youtube : existente.link_youtube,
    ativo === undefined ? existente.ativo : (ativo ? 1 : 0),
    req.params.id,
  ]);
  res.json(await db.get('SELECT * FROM temas WHERE id = ?', [req.params.id]));
});

router.delete('/temas/:id', async (req, res) => {
  await db.run('DELETE FROM temas WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

router.post('/temas/reordenar', async (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids)) return res.status(400).json({ erro: 'ids deve ser um array' });
  await db.transaction(async (client) => {
    for (let idx = 0; idx < ids.length; idx += 1) {
      await client.query('UPDATE temas SET ordem = $1 WHERE id = $2', [idx, ids[idx]]);
    }
  });
  res.json({ ok: true });
});

// ---------- Acessos (pedidos) ----------

// GET /api/admin/acessos?estado=pendente|pago|expirado|rejeitado
router.get('/acessos', async (req, res) => {
  const linhas = await db.all(
    `SELECT a.*, al.nome AS aluno_nome, al.whatsapp AS aluno_whatsapp, u.nome AS unidade_nome, u.preco AS unidade_preco
     FROM acessos a
     JOIN alunos al ON al.id = a.aluno_id
     JOIN unidades u ON u.id = a.unidade_id
     ORDER BY a.data_pedido DESC`
  );

  let resultado = linhas.map((a) => ({ ...a, estado_visivel: estadoVisivel(a) }));

  const { estado } = req.query;
  if (estado) {
    resultado = resultado.filter((a) => a.estado_visivel === estado);
  }

  res.json(resultado);
});

// POST /api/admin/acessos/:id/confirmar — muda para 'pago' e calcula data_expiracao
router.post('/acessos/:id/confirmar', async (req, res) => {
  const acesso = await db.get('SELECT * FROM acessos WHERE id = ?', [req.params.id]);
  if (!acesso) return res.status(404).json({ erro: 'Pedido não encontrado' });
  if (acesso.estado !== 'pendente') {
    return res.status(409).json({ erro: `Pedido já está com estado '${acesso.estado}'` });
  }

  const cfg = await db.get('SELECT duracao_acesso_dias FROM configuracao WHERE id = 1');
  const agora = hojeISO();
  const expiracao = adicionarDias(agora, cfg.duracao_acesso_dias);

  await db.run(`UPDATE acessos SET estado = 'pago', data_confirmacao = ?, data_expiracao = ? WHERE id = ?`, [
    agora,
    expiracao,
    req.params.id,
  ]);

  res.json(await db.get('SELECT * FROM acessos WHERE id = ?', [req.params.id]));
});

// POST /api/admin/acessos/:id/rejeitar
router.post('/acessos/:id/rejeitar', async (req, res) => {
  const acesso = await db.get('SELECT * FROM acessos WHERE id = ?', [req.params.id]);
  if (!acesso) return res.status(404).json({ erro: 'Pedido não encontrado' });
  if (acesso.estado !== 'pendente') {
    return res.status(409).json({ erro: `Pedido já está com estado '${acesso.estado}'` });
  }
  await db.run(`UPDATE acessos SET estado = 'rejeitado' WHERE id = ?`, [req.params.id]);
  res.json(await db.get('SELECT * FROM acessos WHERE id = ?', [req.params.id]));
});

// DELETE /api/admin/acessos/:id — apaga permanentemente um pedido de acesso
router.delete('/acessos/:id', async (req, res) => {
  const existente = await db.get('SELECT id FROM acessos WHERE id = ?', [req.params.id]);
  if (!existente) return res.status(404).json({ erro: 'Pedido não encontrado' });
  await db.run('DELETE FROM acessos WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

// ---------- Alunos (lista + histórico) ----------

router.get('/alunos', async (req, res) => {
  const alunos = await db.all('SELECT id, nome, whatsapp, data_registo FROM alunos ORDER BY data_registo DESC');
  const resultado = await Promise.all(
    alunos.map(async (al) => {
      const historico = (
        await db.all(
          `SELECT a.id, a.estado, a.codigo_referencia, a.data_pedido, a.data_confirmacao, a.data_expiracao, u.nome AS unidade_nome
           FROM acessos a JOIN unidades u ON u.id = a.unidade_id
           WHERE a.aluno_id = ? ORDER BY a.data_pedido DESC`,
          [al.id]
        )
      ).map((h) => ({ ...h, estado_visivel: estadoVisivel(h) }));
      return { ...al, historico };
    })
  );
  res.json(resultado);
});

// DELETE /api/admin/alunos/:id — remove o aluno e (por ON DELETE CASCADE) os seus acessos/pedidos
router.delete('/alunos/:id', async (req, res) => {
  const existente = await db.get('SELECT id FROM alunos WHERE id = ?', [req.params.id]);
  if (!existente) return res.status(404).json({ erro: 'Aluno não encontrado' });
  await db.run('DELETE FROM alunos WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

// ---------- Configurações ----------

router.get('/config', async (req, res) => {
  res.json(await db.get('SELECT * FROM configuracao WHERE id = 1'));
});

router.put('/config', async (req, res) => {
  const existente = await db.get('SELECT * FROM configuracao WHERE id = 1');
  const { nome_escola, logo_url, whatsapp_admin, duracao_acesso_dias } = req.body || {};
  await db.run(
    'UPDATE configuracao SET nome_escola = ?, logo_url = ?, whatsapp_admin = ?, duracao_acesso_dias = ? WHERE id = 1',
    [
      nome_escola ?? existente.nome_escola,
      logo_url ?? existente.logo_url,
      whatsapp_admin ?? existente.whatsapp_admin,
      duracao_acesso_dias ?? existente.duracao_acesso_dias,
    ]
  );
  res.json(await db.get('SELECT * FROM configuracao WHERE id = 1'));
});

module.exports = router;
