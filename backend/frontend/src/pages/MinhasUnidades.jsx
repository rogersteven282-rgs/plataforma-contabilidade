import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Layout from '../components/Layout';
import TicketCard from '../components/TicketCard';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { linkWhatsapp } from '../utils/whatsapp';

export default function MinhasUnidades() {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const { aluno, carregando } = useAuth();
  const config = useConfig();
  const navigate = useNavigate();

  useEffect(() => {
    if (!aluno) return;
    api
      .get('/alunos/me/acessos')
      .then(setLista)
      .catch(() => setErro('Não foi possível carregar as suas unidades.'));
  }, [aluno]);

  if (carregando) return null;
  if (!aluno) return <Navigate to="/entrar" state={{ depoisDe: '/minhas-unidades' }} replace />;

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Minhas Unidades</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">Tudo o que já pediu ou comprou.</p>

      {erro && <p className="mt-4 text-sm" style={{ color: 'var(--brick)' }}>{erro}</p>}

      <div className="mt-5 space-y-3">
        {lista === null && !erro && (
          <div className="animate-pulse space-y-3">
            <div className="h-24 rounded-2xl bg-black/[0.04]" />
            <div className="h-24 rounded-2xl bg-black/[0.04]" />
          </div>
        )}

        {lista?.length === 0 && (
          <div className="rounded-2xl bg-[var(--bg-soft)] p-5 text-center">
            <p className="text-sm text-[var(--cream-soft)]">Ainda não pediu acesso a nenhuma unidade.</p>
            <button onClick={() => navigate('/')} className="mt-3 text-sm font-semibold text-[var(--mango)]">
              Ver classes disponíveis →
            </button>
          </div>
        )}

        {lista?.map((acesso) => (
          <div key={acesso.id} onClick={() => navigate(`/unidades/${acesso.unidade_id}`)} className="cursor-pointer">
            <TicketCard
              acesso={acesso}
              acaoWhatsapp={(e) => {
                e.stopPropagation();
                const link = linkWhatsapp({
                  whatsappAdmin: config?.whatsapp_admin,
                  alunoNome: aluno.nome,
                  unidadeNome: acesso.unidade_nome,
                  codigo: acesso.codigo_referencia,
                });
                if (link) window.open(link, '_blank', 'noopener');
              }}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
}
