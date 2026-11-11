import { NavLink } from 'react-router-dom';

const ITENS = [
  {
    to: '/',
    label: 'Início',
    icone: (ativo) => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={ativo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/minhas-unidades',
    label: 'Minhas Unidades',
    icone: (ativo) => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={ativo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <path d="M3.5 9.5h17" strokeLinecap="round" />
        <path d="M8 3v3M16 3v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icone: (ativo) => (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={ativo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.2-3.5 4-5.2 7-5.2s5.8 1.7 7 5.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-black/10 bg-[var(--bg-soft)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação principal"
    >
      {ITENS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
        >
          {({ isActive }) => (
            <>
              <span style={{ color: isActive ? 'var(--mango)' : 'var(--cream-soft)' }}>{item.icone(isActive)}</span>
              <span style={{ color: isActive ? 'var(--mango)' : 'var(--cream-soft)' }}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
