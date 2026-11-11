const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL não definida.');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

function toPg(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function all(sql, params = []) {
  const res = await pool.query(toPg(sql), params);
  return res.rows;
}

async function get(sql, params = []) {
  const rows = await all(sql, params);
  return rows[0];
}

async function run(sql, params = []) {
  const res = await pool.query(toPg(sql), params);
  return {
    changes: res.rowCount,
    id: res.rows[0]?.id ?? null,
  };
}

async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await fn(client);
    await client.query('COMMIT');
    return resultado;
  } catch (erro) {
    await client.query('ROLLBACK');
    throw erro;
  } finally {
    client.release();
  }
}

async function migrate() {
  await pool.query(`
    -- Tabelas antigas (Mantidas para não quebrar o sistema de login)
    CREATE TABLE IF NOT EXISTS alunos (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      whatsapp TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      data_registo TEXT NOT NULL DEFAULT (now()::text)
    );

    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS configuracao (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      nome_escola TEXT NOT NULL DEFAULT 'Plataforma Contabilidade IA',
      logo_url TEXT,
      whatsapp_admin TEXT,
      duracao_acesso_dias INTEGER NOT NULL DEFAULT 30
    );

    -- NOVAS TABELAS DO PROJETO DE CONTABILIDADE
    
    ALTER TABLE alunos ADD COLUMN IF NOT EXISTS creditos INTEGER DEFAULT 0;

    CREATE TABLE IF NOT EXISTS empresa_simulada (
      id SERIAL PRIMARY KEY,
      aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
      nome_empresa TEXT NOT NULL,
      tipo_sociedade TEXT NOT NULL,
      capital_social REAL DEFAULT 0,
      data_criacao TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS logs_ia (
      id SERIAL PRIMARY KEY,
      aluno_id INTEGER REFERENCES alunos(id) ON DELETE SET NULL,
      modulo TEXT,
      pergunta TEXT,
      resposta TEXT,
      tokens_usados INTEGER DEFAULT 0,
      data_pedido TIMESTAMP DEFAULT NOW()
    );

    -- Novas configurações
    ALTER TABLE configuracao
      ADD COLUMN IF NOT EXISTS email TEXT,
      ADD COLUMN IF NOT EXISTS morada TEXT,
      ADD COLUMN IF NOT EXISTS horario TEXT,
      ADD COLUMN IF NOT EXISTS youtube_url TEXT,
      ADD COLUMN IF NOT EXISTS facebook_url TEXT;
  `);

  const cfg = await get('SELECT id FROM configuracao WHERE id = 1');
  if (!cfg) {
    await run(
      `INSERT INTO configuracao (id, nome_escola, logo_url, whatsapp_admin, duracao_acesso_dias)
       VALUES (1, 'Plataforma Contabilidade IA', NULL, NULL, 30)`
    );
  }
}

module.exports = { all, get, run, transaction, migrate, pool };
