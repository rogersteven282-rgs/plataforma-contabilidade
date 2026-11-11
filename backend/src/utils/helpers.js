const { customAlphabet } = require('nanoid');

// Alfabeto sem caracteres ambíguos (0/O, 1/I) para códigos fáceis de ler por WhatsApp
const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 4);

function gerarCodigoReferencia() {
  return `SV-${nanoid()}`;
}

function hojeISO() {
  return new Date().toISOString();
}

function adicionarDias(dataISO, dias) {
  const d = new Date(dataISO);
  d.setDate(d.getDate() + Number(dias));
  return d.toISOString();
}

// Deriva o estado "visível" de um acesso a partir do estado guardado + data_expiracao.
// 'expirado' nunca é gravado na BD (conforme a regra: sem job/cron); é calculado aqui.
function estadoVisivel(acesso) {
  if (acesso.estado === 'pago' && acesso.data_expiracao) {
    if (new Date(acesso.data_expiracao).getTime() < Date.now()) {
      return 'expirado';
    }
  }
  return acesso.estado;
}

function acessoAtivo(acesso) {
  return acesso.estado === 'pago' && estadoVisivel(acesso) === 'pago';
}

module.exports = {
  gerarCodigoReferencia,
  hojeISO,
  adicionarDias,
  estadoVisivel,
  acessoAtivo,
};
