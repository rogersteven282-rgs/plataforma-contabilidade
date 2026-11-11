export default function Modal({ titulo, children, aoFechar, aoConfirmar, textoConfirmar = 'Confirmar', aConfirmar = false, perigo = false }) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={aoFechar}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-[var(--paper)] p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold text-[var(--ink)]">{titulo}</h2>
        <div className="mt-2 text-sm text-[var(--ink-soft)]">{children}</div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={aoFechar}
            className="flex-1 rounded-xl border border-[var(--ink-soft)]/25 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-black/5"
          >
            Cancelar
          </button>
          <button
            onClick={aoConfirmar}
            disabled={aConfirmar}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
              perigo ? 'bg-[var(--brick)] text-white' : 'bg-[var(--mango)] text-[var(--mango-ink)]'
            }`}
          >
            {aConfirmar ? 'A processar…' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
