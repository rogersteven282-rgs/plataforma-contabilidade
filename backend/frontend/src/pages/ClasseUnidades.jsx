import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function ClasseUnidades() {
  const { classeId } = useParams();
  const [unidades, setUnidades] = useState(null);
  const [erro, setErro] = useState('');
  const { aluno } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/classes/${classeId}/unidades`)
      .then(setUnidades)
      .catch(() => setErro('Não foi possível carregar as unidades desta classe.'));
  }, [classeId, aluno]);

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="mb-3 text-sm font-medium text-[var(--mango)]">
        ← Voltar
      </button>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Unidades</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">
        Escolha uma unidade para ver os temas incluídos.
      </p>

      {erro && <p className="mt-4 text-sm" style={{ color: 'var(--brick)' }}>{erro}</p>}

      <div className="mt-5 space-y-3">
        {unidades === null && !erro && (
          <div className="animate-pulse space-y-3">
            <div className="h-20 rounded-2xl bg-black/[0.04]" />
            <div className="h-20 rounded-2xl bg-black/[0.04]" />
          </div>
        )}

        {unidades?.length === 0 && (
          <p className="text-sm text-[var(--cream-soft)]">Ainda não há unidades disponíveis nesta classe.</p>
        )}

        {unidades?.map((u) => (
          <Link
            key={u.id}
            to={`/unidades/${u.id}`}
            className="block rounded-2xl bg-[var(--bg-soft)] p-4 transition hover:bg-black/[0.04]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-semibold text-[var(--cream)]">{u.nome}</h2>
              {u.meu_acesso ? (
                <StatusBadge estado={u.meu_acesso.estado} />
              ) : (
                <span className="shrink-0 font-mono-ref text-sm font-semibold text-[var(--mango)]">{u.preco} MT</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
