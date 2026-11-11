import StatusBadge from './StatusBadge';

function formatarData(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TicketCard({ acesso, acaoWhatsapp }) {
  const { unidade_nome, classe_nome, codigo_referencia, estado, data_expiracao, unidade_preco } = acesso;

  return (
    <div className="flex overflow-hidden rounded-2xl shadow-lg shadow-black/20">
      {/* Corpo principal do bilhete */}
      <div className="flex-1 bg-[var(--paper)] p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            {classe_nome && <p className="text-xs font-medium text-[var(--ink-soft)]">{classe_nome}</p>}
            <h3 className="font-display text-lg font-semibold leading-snug text-[var(--ink)]">{unidade_nome}</h3>
          </div>
          <StatusBadge estado={estado} />
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-[var(--ink-soft)]/25 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">Código</p>
            <p className="font-mono-ref text-base font-semibold text-[var(--ink)]">{codigo_referencia}</p>
          </div>
          {unidade_preco !== undefined && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[var(--ink-soft)]">Valor</p>
              <p className="font-mono-ref text-base font-semibold text-[var(--ink)]">{unidade_preco} MT</p>
            </div>
          )}
        </div>

        {estado === 'pago' && data_expiracao && (
          <p className="mt-2 text-xs text-[var(--ink-soft)]">Válido até {formatarData(data_expiracao)}</p>
        )}
        {estado === 'expirado' && (
          <p className="mt-2 text-xs text-[var(--brick)]">Expirou a {formatarData(data_expiracao)} — renove abaixo</p>
        )}
        {estado === 'pendente' && (
          <p className="mt-2 text-xs text-[var(--ink-soft)]">Aguardando confirmação do pagamento pelo professor</p>
        )}
      </div>

      {/* Talão destacável */}
      {acaoWhatsapp && (estado === 'pendente' || estado === 'expirado') && (
        <button
          onClick={acaoWhatsapp}
          className="ticket-notch flex w-24 shrink-0 flex-col items-center justify-center gap-1 bg-[var(--mango)] px-2 text-center text-[var(--mango-ink)] transition hover:brightness-105 active:brightness-95"
          style={{ borderLeft: '2px dashed var(--bg)' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7C17.18 3.03 14.68 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.32a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.55-3.7 8.25-8.24 8.25Z" />
          </svg>
          <span className="text-[11px] font-bold leading-tight">Pagar</span>
        </button>
      )}
    </div>
  );
}
