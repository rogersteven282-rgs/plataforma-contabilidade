import { useCallback, useEffect, useState } from 'react';
import { apiAdmin } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import MensagemErro from '../../components/MensagemErro';
import Modal from '../../components/admin/Modal';

const FILTROS = [
  { valor: '', label: 'Todos' },
  { valor: 'pendente', label: 'Pendentes' },
  { valor: 'pago', label: 'Pagos' },
  { valor: 'expirado', label: 'Expirados' },
  { valor: 'rejeitado', label: 'Rejeitados' },
];

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminPedidos() {
  const [filtro, setFiltro] = useState('pendente');
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState('');
  const [aProcessar, setAProcessar] = useState(null);
  const [rejeitarId, setRejeitarId] = useState(null);

  const carregar = useCallback(() => {
    setLista(null);
    const caminho = filtro ? `/admin/acessos?estado=${filtro}` : '/admin/acessos';
    apiAdmin
      .get(caminho)
      .then(setLista)
      .catch((e) => setErro(e.message));
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function confirmar(id) {
    setAProcessar(id);
    setErro('');
    try {
      await apiAdmin.post(`/admin/acessos/${id}/confirmar`);
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setAProcessar(null);
    }
  }

  async function rejeitar(id) {
    setAProcessar(id);
    setErro('');
    try {
      await apiAdmin.post(`/admin/acessos/${id}/rejeitar`);
      setRejeitarId(null);
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setAProcessar(null);
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Pedidos de acesso</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">
        Confirme o pagamento depois de verificar o comprovativo enviado no WhatsApp.
      </p>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filtro === f.valor
                ? 'bg-[var(--mango)] text-[var(--mango-ink)]'
                : 'bg-black/[0.04] text-[var(--cream-soft)] hover:bg-black/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-2">
        <MensagemErro>{erro}</MensagemErro>
      </div>

      <div className="mt-4 space-y-3">
        {lista === null && !erro && (
          <div className="animate-pulse space-y-3">
            <div className="h-28 rounded-2xl bg-black/[0.04]" />
            <div className="h-28 rounded-2xl bg-black/[0.04]" />
          </div>
        )}

        {lista?.length === 0 && (
          <p className="rounded-2xl bg-[var(--bg-soft)] p-5 text-center text-sm text-[var(--cream-soft)]">
            Não há pedidos nesta categoria.
          </p>
        )}

        {lista?.map((p) => {
          const estado = p.estado_visivel || p.estado;
          return (
          <div key={p.id} className="rounded-2xl bg-[var(--bg-soft)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-[var(--cream)]">{p.aluno_nome}</p>
                <p className="font-mono-ref text-xs text-[var(--cream-soft)]">{p.aluno_whatsapp}</p>
              </div>
              <StatusBadge estado={estado} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-black/10 pt-3 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--cream-soft)]">Unidade</p>
                <p className="text-[var(--cream)]">{p.unidade_nome}</p>
                {p.classe_nome && <p className="text-xs text-[var(--cream-soft)]">{p.classe_nome}</p>}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--cream-soft)]">Código</p>
                <p className="font-mono-ref text-[var(--cream)]">{p.codigo_referencia}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--cream-soft)]">Pedido em</p>
                <p className="text-[var(--cream)]">{formatarData(p.data_pedido)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--cream-soft)]">
                  {estado === 'pago' || estado === 'expirado' ? 'Válido até' : 'Valor'}
                </p>
                <p className="text-[var(--cream)]">
                  {estado === 'pago' || estado === 'expirado' ? formatarData(p.data_expiracao) : `${p.unidade_preco} MT`}
                </p>
              </div>
            </div>

            {p.estado === 'pendente' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => confirmar(p.id)}
                  disabled={aProcessar === p.id}
                  className="flex-1 rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
                >
                  {aProcessar === p.id ? 'A confirmar…' : 'Confirmar pagamento'}
                </button>
                <button
                  onClick={() => setRejeitarId(p.id)}
                  disabled={aProcessar === p.id}
                  className="rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-[var(--cream-soft)] transition hover:bg-black/[0.04] disabled:opacity-50"
                >
                  Rejeitar
                </button>
              </div>
            )}
          </div>
          );
        })}
      </div>

      {rejeitarId !== null && (
        <Modal
          titulo="Rejeitar pedido"
          aoFechar={() => setRejeitarId(null)}
          aoConfirmar={() => rejeitar(rejeitarId)}
          textoConfirmar="Rejeitar pedido"
          aConfirmar={aProcessar === rejeitarId}
          perigo
        >
          Tem a certeza de que quer rejeitar este pedido? O aluno poderá submeter um novo pedido depois.
        </Modal>
      )}
    </AdminLayout>
  );
}
