require('dotenv').config();
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 4000;

db.migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sala Virtual — API a correr em http://localhost:${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('Falha ao ligar à base de dados / correr migrações:', erro);
    process.exit(1);
  });
