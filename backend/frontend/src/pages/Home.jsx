import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

export default function Home() {
  const [classes, setClasses] = useState(null);
  const [erro, setErro] = useState('');
  const { aluno } = useAuth();
  const config = useConfig();

  useEffect(() => {
    api
      .get('/classes')
      .then(setClasses)
      .catch(() => setErro('Não foi possível carregar as classes.'));
  }, []);

  return (
    <Layout>
      <section className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--mango)]">
          {aluno ? `Olá, ${aluno.nome.split(' ')[0]}` : 'Bem-vindo(a)'}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold leading-snug text-[var(--cream)]">
          Aulas em vídeo, no seu ritmo.
        </h1>
        <p className="mt-2 text-sm text-[var(--cream-soft)]">
          {config?.nome_escola ? `Conteúdo de ${config.nome_escola}` : 'Escolha a sua classe e comece a estudar.'}{' '}
          Veja uma aula grátis de amostra antes de pedir acesso a uma unidade completa.
        </p>
      </section>

      {erro && <p className="mb-4 text-sm" style={{ color: 'var(--brick)' }}>{erro}</p>}

      <div className="space-y-3">
        {classes === null && !erro && (
          <div className="animate-pulse space-y-3">
            <div className="h-24 rounded-2xl bg-black/[0.04]" />
            <div className="h-24 rounded-2xl bg-black/[0.04]" />
          </div>
        )}

        {classes?.length === 0 && (
          <p className="text-sm text-[var(--cream-soft)]">Ainda não há classes disponíveis.</p>
        )}

        {classes?.map((c) => (
          <div key={c.id} className="rounded-2xl bg-[var(--bg-soft)] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-[var(--cream)]">{c.nome}</h2>
              <Link
                to={`/classes/${c.id}`}
                className="shrink-0 rounded-lg bg-[var(--mango)] px-3 py-1.5 text-xs font-bold text-[var(--mango-ink)]"
              >
                Ver unidades
              </Link>
            </div>
            {c.video_gratuito_url && (
              <a
                href={c.video_gratuito_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 text-sm font-medium text-[var(--mango)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Assistir aula grátis de amostra
              </a>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
