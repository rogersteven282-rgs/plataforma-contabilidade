require('dotenv').config();
const db = require('./db');
const { hashValor, gerarChaveRecuperacao } = require('./utils/auth');

// Programa real de Física — 12ª Classe — Prof. Bento Jeremias Queha
// Preços e links do YouTube ficam em placeholder: preencher depois pelo painel admin.
const PROGRAMA = [
  {
    nome: 'Unidade I — Ondas Electromagnéticas & Radiação do Corpo Negro',
    temas: [
      'Radiações electromagnéticas',
      'Radiações Térmicas (Lei de Wien, Lei de Stefan-Boltzmann)',
      'Efeito fotoeléctrico',
      'Energia e massa segundo Einstein',
      'Níveis de energia',
      'Raios-X',
      'Calorimetria',
    ],
  },
  {
    nome: 'Unidade II — Física Nuclear',
    temas: [
      'Elementos isótopos e isóbaros',
      'Reacções nucleares (fusão e fissão)',
      'Reacções de desintegração e suas leis',
      'Energia de ligação e defeito de massa',
    ],
  },
  {
    nome: 'Unidade III — Mecânica dos Fluidos (Hidrodinâmica)',
    temas: [
      'Vazão volumétrica',
      'Princípio de continuidade',
      'Princípio de Bernoulli',
    ],
  },
  {
    nome: 'Unidade IV — Gases & Termodinâmica',
    temas: [
      'Parâmetros de estado de gás ideal',
      'Equação de gases ideais',
      'Isoprocessos e diagramas',
      'Trabalho termodinâmico',
      'A 1ª lei da termodinâmica',
    ],
  },
  {
    nome: 'Unidade V — Oscilações Mecânicas',
    temas: [
      'Características de oscilações mecânicas',
      'Equações e gráficos em função do tempo (elongação, velocidade e aceleração)',
      'Equações de Thompson',
    ],
  },
  {
    nome: 'Unidade VI — Mecânica',
    temas: [
      'Trabalho, potência e energia',
      'Lei de conservação de energia',
      'Impulso e Quantidade de movimento',
    ],
  },
];

const PRECO_PLACEHOLDER = 500;

async function seed() {
  const jaTemClasses = (await db.get('SELECT COUNT(*) AS n FROM classes')).n > 0;
  if (jaTemClasses) {
    console.log('Seed ignorado: já existem dados na base de dados.');
    return;
  }

  const infoClasse = await db.run(
    'INSERT INTO classes (nome, video_gratuito_url) VALUES (?, ?) RETURNING id',
    ['12ª Classe — Física', null]
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

  await db.run(
    'UPDATE configuracao SET nome_escola = ?, whatsapp_admin = ?, duracao_acesso_dias = ? WHERE id = 1',
    ['Segredos da Física — Prof. Bento Jeremias Queha', '258840000000', 30]
  );

  // Admin de exemplo (username: admin / password: admin123) — trocar em produção!
  const jaTemAdmin = (await db.get('SELECT COUNT(*) AS n FROM admins')).n > 0;
  if (!jaTemAdmin) {
    const chave = gerarChaveRecuperacao();
    const chaveHash = hashValor(chave);

    await db.run(
      'INSERT INTO admins (username, password_hash, recovery_key_hash) VALUES (?, ?, ?)',
      ['admin', hashValor('admin123'), chaveHash]
    );

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ADMIN CRIADO');
    console.log('  Username: admin');
    console.log('  Password: admin123  (troque depois!)');
    console.log('');
    console.log('  CHAVE DE RECUPERAÇÃO (guarde agora!):');
    console.log('  ' + chave);
    console.log('');
    console.log('  Esta chave NÃO será mostrada novamente.');
    console.log('  Use-a em /admin/recuperar se esquecer a password.');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
  }

  console.log(`Seed concluído: 1 classe, ${PROGRAMA.length} unidades, ${totalTemas} temas.`);
}

db.migrate()
  .then(seed)
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });