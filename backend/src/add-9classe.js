require('dotenv').config();
const db = require('./db');

// Programa real de Física — 9ª Classe — Prof. Bento Jeremias Queha
// (Plano de preparação para exame final)
// Preços e links do YouTube ficam em placeholder: preencher depois pelo painel admin.
const NOME_CLASSE = '9ª Classe — Física';

const PROGRAMA = [
  {
    nome: 'Unidade I — Óptica Geométrica',
    temas: [
      'Espelhos Esféricos e Reflexão',
      'Refracção da Luz e Lentes',
    ],
  },
  {
    nome: 'Unidade II — Estática dos Sólidos e Máquinas Simples',
    temas: [
      'Fundamentos da Estática dos Sólidos',
      'Máquinas Simples',
    ],
  },
  {
    nome: 'Unidade III — Estática dos Fluidos (Hidrostática)',
    temas: [
      'Densidade e Grandeza Pressão',
      'Princípios Fundamentais e Sistemas Hidráulicos',
    ],
  },
  {
    nome: 'Unidade IV — Oscilações e Ondas Mecânicas',
    temas: [
      'Movimento Harmónico Simples (MHS)',
      'Propagação Ondulatória',
    ],
  },
  {
    nome: 'Unidade V — Eletricidade',
    temas: [
      'Circuitos Eléctricos e Resistências',
      'Potência Eléctrica e Efeito Térmico',
    ],
  },
];

const PRECO_PLACEHOLDER = 500;

async function adicionarClasse() {
  const existente = await db.get('SELECT id FROM classes WHERE nome = ?', [NOME_CLASSE]);
  if (existente) {
    console.log(`Já existe uma classe chamada "${NOME_CLASSE}" (id ${existente.id}). Nada foi alterado.`);
    return;
  }

  const infoClasse = await db.run(
    'INSERT INTO classes (nome, video_gratuito_url) VALUES (?, ?) RETURNING id',
    [NOME_CLASSE, null]
  );
  const classeId = infoClasse.id;

  let totalTemas = 0;
  for (let ordemUnidade = 0; ordemUnidade < PROGRAMA.length; ordemUnidade += 1) {
    const unidade = PROGRAMA[ordemUnidade];
    const infoUnidade = await db.run(
      'INSERT INTO unidades (classe_id, nome, ordem, preco, ativo) VALUES (?, ?, ?, ?, 1) RETURNING id',
      [classeId, unidade.nome, ordemUnidade, PRECO_PLACEHOLDER]
    );
    const unidadeId = infoUnidade.id;
    for (let ordemTema = 0; ordemTema < unidade.temas.length; ordemTema += 1) {
      await db.run(
        'INSERT INTO temas (unidade_id, nome, ordem, link_youtube, ativo) VALUES (?, ?, ?, NULL, 1)',
        [unidadeId, unidade.temas[ordemTema], ordemTema]
      );
      totalTemas += 1;
    }
  }

  console.log(`Classe "${NOME_CLASSE}" adicionada: ${PROGRAMA.length} unidades, ${totalTemas} temas.`);
}

db.migrate()
  .then(adicionarClasse)
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
