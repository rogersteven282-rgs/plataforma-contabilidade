const ESTILOS = {
  pendente: { bg: 'var(--amber-soft)', cor: '#7A4B0A', texto: 'Pendente' },
  pago: { bg: 'var(--teal-soft)', cor: 'var(--teal)', texto: 'Ativo' },
  expirado: { bg: 'var(--brick-soft)', cor: 'var(--brick)', texto: 'Expirado' },
  rejeitado: { bg: 'var(--brick-soft)', cor: 'var(--brick)', texto: 'Rejeitado' },
};

export default function StatusBadge({ estado }) {
  const estilo = ESTILOS[estado] || ESTILOS.pendente;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
      style={{ background: estilo.bg, color: estilo.cor }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: estilo.cor }} />
      {estilo.texto}
    </span>
  );
}
