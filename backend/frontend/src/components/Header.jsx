export default function Header({ config, direita }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-[var(--bg)]/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2.5">
        {config?.logo_url ? (
          <img src={config.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mango)] font-display text-sm font-bold text-[var(--mango-ink)]">
            FIS
          </div>
        )}
        <span className="font-display text-base font-semibold text-[var(--cream)]">
          {config?.nome_escola || 'Segredos da Física'}
        </span>
      </div>
      {direita}
    </header>
  );
}
