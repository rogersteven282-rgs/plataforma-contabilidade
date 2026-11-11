import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Botao from '../components/Botao';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { aluno, carregando, sair } = useAuth();

  if (carregando) return null;
  if (!aluno) return <Navigate to="/entrar" state={{ depoisDe: '/perfil' }} replace />;

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Perfil</h1>

      <div className="mt-5 rounded-2xl bg-[var(--bg-soft)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cream-soft)]">Nome</p>
        <p className="mt-0.5 text-base font-medium text-[var(--cream)]">{aluno.nome}</p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--cream-soft)]">WhatsApp</p>
        <p className="mt-0.5 font-mono-ref text-base font-medium text-[var(--cream)]">{aluno.whatsapp}</p>
      </div>

      <div className="mt-6">
        <Botao variante="secundario" onClick={sair}>
          Sair da conta
        </Botao>
      </div>
    </Layout>
  );
}
