import { useEffect, useState } from 'react';
import { apiAdmin } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import MensagemErro from '../../components/MensagemErro';
import Modal from '../../components/admin/Modal';

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminAlunos() {
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const [aberto, setAberto] = useState(null);
  const [busca, setBusca] = useState('');
  const [apagar, setApagar] = useState(null); // { id, nome }
  const [aApagar, setAApagar] = useState(false);

  useEffect(() => {
    apiAdmin
      .get('/admin/alunos')
      .then(setLista)
      .catch((e) => setErro(e.message));
  }, []);

  async function confirmarApagar() {
    setAApagar(true);
    setErro('');
    try {
      await apiAdmin.del(`/admin/alunos/${apagar.id}`);
      setLista((ls) => ls.filter((a) => a.id !== apagar.id));
      setApagar(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setAApagar(false);
    }
  }

  const filtrados = lista?.filter((a) => {
    const alvo = busca.trim().toLowerCase();
    if (!alvo) return true;
    return a.nome.toLowerCase().includes(alvo) || a.whatsapp.includes(alvo);
  });

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Alunos</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">Registados e o histórico de unidades pedidas.</p>

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Procurar por nome ou WhatsApp…"
        className="campo mt-4"
      />

      <div className="mt-3">
        <MensagemErro>{erro}</MensagemErro>
      </div>

      <div className="mt-3 space-y-2">
        {lista === null && !erro && (
          <div className="animate-pulse space-y-2">
            <div className="h-16 rounded-2xl bg-black/[0.04]" />
            <div className="h-16 rounded-2xl bg-black/[0.04]" />
          </div>
        )}

        {filtrados?.length === 0 && (
          <p className="rounded-2xl bg-[var(--bg-soft)] p-5 text-center text-sm text-[var(--cream-soft)]">
            Nenhum aluno encontrado.
          </p>
        )}

        {filtrados?.map((a) => {
          const estaAberto = aberto === a.id;
          return (
            <div key={a.id} className="rounded-2xl bg-[var(--bg-soft)] p-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => setAberto(estaAberto ? null : a.id)}
                  className="flex flex-1 items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="font-display text-base font-semibold text-[var(--cream)]">{a.nome}</p>
                    <p className="font-mono-ref text-xs text-[var(--cream-soft)]">{a.whatsapp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--cream-soft)]">Desde {formatarData(a.data_registo)}</p>
                    <p className="text-xs font-semibold text-[var(--mango)]">
                      {estaAberto ? 'Fechar ▲' : `${a.historico?.length || 0} pedido(s) ▾`}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setApagar({ id: a.id, nome: a.nome })}
                  className="shrink-0 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--brick)] hover:bg-black/[0.04]"
                >
                  Apagar
                </button>
              </div>

              {estaAberto && (
                <div className="mt-3 space-y-2 border-t border-black/10 pt-3">
                  {(!a.historico || a.historico.length === 0) && (
                    <p className="text-sm text-[var(--cream-soft)]">Ainda não pediu nenhuma unidade.</p>
                  )}
                  {a.historico?.map((acesso) => (
                    <div key={acesso.id} className="flex items-center justify-between gap-2 rounded-xl bg-black/[0.04] px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--cream)]">{acesso.unidade_nome}</p>
                        <p className="font-mono-ref text-xs text-[var(--cream-soft)]">{acesso.codigo_referencia}</p>
                      </div>
                      <StatusBadge estado={acesso.estado_visivel || acesso.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {apagar && (
        <Modal
          titulo="Apagar aluno"
          aoFechar={() => setApagar(null)}
          aoConfirmar={confirmarApagar}
          textoConfirmar="Apagar"
          aConfirmar={aApagar}
          perigo
        >
          Tem a certeza de que quer apagar "{apagar.nome}"? Isto remove também todo o seu histórico de pedidos.
          Esta ação não pode ser desfeita.
        </Modal>
      )}
    </AdminLayout>
  );
}
