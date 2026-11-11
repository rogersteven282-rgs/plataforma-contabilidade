import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function Navbar() {
  const { aluno } = useAuth();
  const { admin } = useAdminAuth();

  const links = [
    { to: '/', label: 'Início', end: true },
    { to: '/#aulas-destaque', label: 'Aulas gratuitas' },
    { to: '/perfil', label: 'Perfil' },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B2A5B]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:px-10 md:py-4 lg:px-16 lg:py-5">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-lg font-semibold text-white md:text-2xl">
            Segredos da Física
          </span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-white/60 md:text-xs">
            Sala Virtual
          </span>
        </Link>

        {/* Mobile */}
        <div className="flex items-center justify-between gap-3 md:hidden">
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Navegação principal">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={() =>
                  'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:text-white'
                }
              >
                {l.label}
              </NavLink>
            ))}

            {admin && (
              <Link
                to="/admin/dashboard"
                className="shrink-0 rounded-lg border border-[var(--mango)] px-3 py-1.5 text-xs font-semibold text-[var(--mango)] transition hover:bg-[var(--mango)] hover:text-white"
              >
                Painel
              </Link>
            )}
          </nav>

          {aluno ? (
            <span className="shrink-0 text-sm text-white/70">
              Olá, {aluno.nome.split(' ')[0]}
            </span>
          ) : (
            <Link
              to="/entrar"
              className="shrink-0 text-sm font-semibold text-white/70 transition hover:text-white"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Desktop */}
        <nav className="hidden items-center md:flex md:flex-1 md:justify-end" aria-label="Navegação principal">
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={() =>
                  'rounded-lg px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:text-white lg:px-4 lg:py-2 lg:text-base'
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-10 flex items-center gap-4 lg:ml-16">
            {admin && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--mango)] px-3 py-1.5 text-xs font-semibold text-[var(--mango)] transition hover:bg-[var(--mango)] hover:text-white lg:px-4 lg:py-2 lg:text-sm"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                </svg>
                Voltar ao painel
              </Link>
            )}

            {aluno ? (
              <span className="text-sm text-white/70 lg:text-base">
                Olá, {aluno.nome.split(' ')[0]}
              </span>
            ) : (
              <Link
                to="/entrar"
                className="text-sm font-semibold text-white/70 transition hover:text-white lg:text-base"
              >
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}