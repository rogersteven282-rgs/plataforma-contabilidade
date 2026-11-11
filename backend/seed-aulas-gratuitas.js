require('dotenv').config();
const db = require('./src/db');

// As 4 aulas iniciais — títulos das imagens que já existem em public/images/
// Os links do YouTube são placeholders: o admin deve preenchê-los no painel.
const AULAS = [
  {
    titulo: 'Introdução à Física — Conceitos Fundamentais',
    classe: '9.ª Classe',
    disciplina: 'Física',
    link_youtube: null,
    imagem_url: '/images/aula-1.png',
    ordem: 0,
  },
  {
    titulo: 'Cinemática — Movimento Uniforme e Uniformemente Variado',
    classe: '9.ª Classe',
    disciplina: 'Física',
    link_youtube: null,
    imagem_url: '/images/aula-2.png',
    ordem: 1,
  },
  {
    titulo: 'Leis de Newton — Aplicações no Dia a Dia',
    classe: '12.ª Classe',
    disciplina: 'Física',
    link_youtube: null,
    imagem_url: '/images/aula-3.png',
    ordem: 2,
  },
  {
    titulo: 'Electricidade — Corrente Eléctrica e Resistência',
    classe: '12.ª Classe',
    disciplina: 'Física',
    link_youtube: null,
    imagem_url: '/images/aula-4.png',
    ordem: 3,
  },
];

async function seed() {
  const existentes = await db.get('SELECT COUNT(*)::int AS n FROM aulas_gratuitas');
  if (existentes.n > 0) {
    console.log(`Já existem ${existentes.n} aulas gratuitas na BD. Nada foi criado.`);
    console.log('Se quiseres repor, apaga-as manualmente primeiro.');
    return;
  }

  for (const aula of AULAS) {
    await db.run(
      `INSERT INTO aulas_gratuitas (titulo, classe, disciplina, link_youtube, imagem_url, ordem, ativo)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [aula.titulo, aula.classe, aula.disciplina, aula.link_youtube, aula.imagem_url, aula.ordem]
    );
    console.log(`+ ${aula.titulo}`);
  }

  console.log(`\n${AULAS.length} aulas gratuitas criadas.`);
  console.log('Nota: os links do YouTube estão vazios. Preenche-os no painel admin.');
}

db.migrate()
  .then(seed)
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });