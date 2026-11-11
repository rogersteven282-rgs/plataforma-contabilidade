import { NavLink } from 'react-router-dom';
import Footer from '../Footer';
import { useConfig } from '../../context/ConfigContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

const ABAS = [
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/conteudo', label: 'Conteúdo' },
  { to: '/admin/alunos', label: 'Alunos' },
  { to: '/admin/configuracoes', label: 'Configurações' },
  { to: '/admin/conta', label: 'Conta' },
];

export default function AdminLayout({ children }) {
  const config = useConfig();
  const { sair } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-[var(--bg)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mango)] font-display text-sm font-bold text-[var(--mango-ink)]">
              FIS
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-tight text-[var(--cream)]">
                {config?.nome_escola || 'Segredos da Física'}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--mango)]">
                Painel Admin
              </p>
            </div>
          </div>
          <button
            onClick={sair}
            className="shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-[var(--cream-soft)] transition hover:bg-black/[0.04]"
          >
            Sair
          </button>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-2" aria-label="Secções do painel">
          {ABAS.map((aba) => (
            <NavLink
              key={aba.to}
              to={aba.to}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[var(--mango)] text-[var(--mango-ink)]'
                    : 'text-[var(--cream-soft)] hover:bg-black/[0.04]'
                }`
              }
            >
              {aba.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-5">{children}</main>
      <Footer largura="max-w-4xl" />
    </div>
  );
}
