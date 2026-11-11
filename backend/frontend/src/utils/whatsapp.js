export function linkWhatsapp({ whatsappAdmin, alunoNome, unidadeNome, codigo }) {
  if (!whatsappAdmin) return null;
  const mensagem = `Olá! Sou ${alunoNome}. Quero pagar a unidade "${unidadeNome}" (código ${codigo}).`;
  return `https://wa.me/${whatsappAdmin.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}
