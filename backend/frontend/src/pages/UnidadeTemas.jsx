import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Layout from '../components/Layout';
import Botao from '../components/Botao';
import TicketCard from '../components/TicketCard';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { linkWhatsapp } from '../utils/whatsapp';

export default function UnidadeTemas() {
  const { unidadeId } = useParams();
  const [dados, setDados] = useState(null);
  const [meuAcesso, setMeuAcesso] = useState(undefined); // undefined = ainda a carregar, null = nunca pedido
  const [erro, setErro] = useState('');
  const [aPedir, setAPedir] = useState(false);
  const { aluno } = useAuth();
  const config = useConfig();
  const navigate = useNavigate();

  const carregar = useCallback(() => {
    api
      .get(`/unidades/${unidadeId}/temas`)
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar esta unidade.'));

    if (aluno) {
      api
        .get('/alunos/me/acessos')
        .then((lista) => {
          const encontrado = lista.find((a) => a.unidade_id === Number(unidadeId));
          setMeuAcesso(encontrado || null);
        })
        .catch(() => setMeuAcesso(null));
    } else {
      setMeuAcesso(null);
    }
  }, [unidadeId, aluno]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function pedirAcesso() {
    setAPedir(true);
    setErro('');
    try {
      await api.post('/alunos/me/acessos', { unidade_id: Number(unidadeId) });
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setAPedir(false);
    }
  }

  function abrirWhatsapp() {
    const link = linkWhatsapp({
      whatsappAdmin: config?.whatsapp_admin,
      alunoNome: aluno?.nome,
      unidadeNome: dados?.unidade?.nome,
      codigo: meuAcesso?.codigo_referencia,
    });
    if (link) window.open(link, '_blank', 'noopener');
  }

  const podePedir = meuAcesso === null || (meuAcesso && ['expirado', 'rejeitado'].includes(meuAcesso.estado));

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="mb-3 text-sm font-medium text-[var(--mango)]">
        ← Voltar
      </button>

      {erro && <p className="mb-4 text-sm" style={{ color: 'var(--brick)' }}>{erro}</p>}

      {!dados && !erro && (
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-2/3 rounded bg-black/[0.04]" />
          <div className="h-16 rounded-2xl bg-black/[0.04]" />
        </div>
      )}

      {dados && (
        <>
          <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">{dados.unidade.nome}</h1>
          <p className="mt-1 text-sm text-[var(--cream-soft)]">
            {dados.temas.length} tema{dados.temas.length === 1 ? '' : 's'} · {dados.unidade.preco} MT
          </p>

          {/* Bilhete de acesso: aparece quando há um pedido em curso, expirado ou rejeitado */}
          {meuAcesso && (
            <div className="mt-5">
              <TicketCard acesso={meuAcesso} acaoWhatsapp={abrirWhatsapp} />
              {meuAcesso.estado === 'rejeitado' && (
                <p className="mt-2 text-xs text-[var(--cream-soft)]">
                  O pedido anterior foi rejeitado. Pode tentar novamente abaixo.
                </p>
              )}
            </div>
          )}

          {!dados.tem_acesso && (
            <div className="mt-5 space-y-2 rounded-2xl bg-[var(--bg-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cream-soft)]">Temas</p>
              <ul className="space-y-2">
                {dados.temas.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm text-[var(--cream)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--cream-soft)]" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4.5" y="10" width="15" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                    </svg>
                    {t.nome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dados.tem_acesso && (
            <div className="mt-5 space-y-2">
              {dados.temas.map((t) => (
                <a
                  key={t.id}
                  href={t.link_youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-[var(--bg-soft)] p-3.5 transition hover:bg-black/[0.04]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--mango)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[var(--mango-ink)]">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-[var(--cream)]">{t.nome}</span>
                </a>
              ))}
            </div>
          )}

          {podePedir && (
            <div className="mt-6">
              {!aluno ? (
                <Botao onClick={() => navigate('/entrar', { state: { depoisDe: `/unidades/${unidadeId}` } })}>
                  Entrar para pedir acesso
                </Botao>
              ) : (
                <Botao onClick={pedirAcesso} disabled={aPedir}>
                  {aPedir ? 'A criar pedido…' : `Pedir acesso — ${dados.unidade.preco} MT`}
                </Botao>
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
