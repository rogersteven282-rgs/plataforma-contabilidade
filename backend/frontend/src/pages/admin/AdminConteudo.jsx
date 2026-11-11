import { useEffect, useState } from 'react';
import { apiAdmin } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import Botao from '../../components/Botao';
import Campo from '../../components/Campo';
import MensagemErro from '../../components/MensagemErro';
import Modal from '../../components/admin/Modal';

// ---------- Formulários (criar/editar) ----------

function FormClasse({ inicial, aoSubmeter, aoCancelar }) {
  const [nome, setNome] = useState(inicial?.nome || '');
  const [videoUrl, setVideoUrl] = useState(inicial?.video_gratuito_url || '');
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      await aoSubmeter({ nome, video_gratuito_url: videoUrl || null });
    } catch (e) {
      setErro(e.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-xl bg-black/[0.04] p-3">
      <Campo label="Nome da classe">
        <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: 9ª Classe" className="campo" />
      </Campo>
      <Campo label="Vídeo grátis de amostra (link do YouTube, opcional)">
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/…" className="campo" />
      </Campo>
      <MensagemErro>{erro}</MensagemErro>
      <div className="flex gap-2">
        <Botao type="submit" disabled={aEnviar} className="flex-1">
          {aEnviar ? 'A guardar…' : 'Guardar'}
        </Botao>
        <Botao type="button" variante="secundario" onClick={aoCancelar} className="flex-1">
          Cancelar
        </Botao>
      </div>
    </form>
  );
}

function FormUnidade({ inicial, aoSubmeter, aoCancelar }) {
  const [nome, setNome] = useState(inicial?.nome || '');
  const [preco, setPreco] = useState(inicial?.preco ?? '');
  const [ordem, setOrdem] = useState(inicial?.ordem ?? '');
  const [ativo, setAtivo] = useState(inicial?.ativo ?? true);
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      await aoSubmeter({ nome, preco: Number(preco), ordem: Number(ordem) || 0, ativo });
    } catch (e) {
      setErro(e.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-xl bg-black/[0.04] p-3">
      <Campo label="Nome da unidade">
        <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Unidade 1 — Funções" className="campo" />
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo label="Preço (MT)">
          <input required type="number" min="0" value={preco} onChange={(e) => setPreco(e.target.value)} className="campo" />
        </Campo>
        <Campo label="Ordem">
          <input type="number" min="0" value={ordem} onChange={(e) => setOrdem(e.target.value)} placeholder="0" className="campo" />
        </Campo>
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--cream)]">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="h-4 w-4 accent-[var(--mango)]" />
        Unidade ativa (visível para os alunos)
      </label>
      <MensagemErro>{erro}</MensagemErro>
      <div className="flex gap-2">
        <Botao type="submit" disabled={aEnviar} className="flex-1">
          {aEnviar ? 'A guardar…' : 'Guardar'}
        </Botao>
        <Botao type="button" variante="secundario" onClick={aoCancelar} className="flex-1">
          Cancelar
        </Botao>
      </div>
    </form>
  );
}

function FormTema({ inicial, aoSubmeter, aoCancelar }) {
  const [nome, setNome] = useState(inicial?.nome || '');
  const [link, setLink] = useState(inicial?.link_youtube || '');
  const [ordem, setOrdem] = useState(inicial?.ordem ?? '');
  const [ativo, setAtivo] = useState(inicial?.ativo ?? true);
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      await aoSubmeter({ nome, link_youtube: link, ordem: Number(ordem) || 0, ativo });
    } catch (e) {
      setErro(e.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-xl bg-black/[0.04] p-3">
      <Campo label="Nome do tema">
        <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Introdução a funções" className="campo" />
      </Campo>
      <Campo label="Link do vídeo (YouTube)">
        <input required value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtube.com/…" className="campo" />
      </Campo>
      <Campo label="Ordem">
        <input type="number" min="0" value={ordem} onChange={(e) => setOrdem(e.target.value)} placeholder="0" className="campo" />
      </Campo>
      <label className="flex items-center gap-2 text-sm text-[var(--cream)]">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="h-4 w-4 accent-[var(--mango)]" />
        Tema ativo (visível para os alunos)
      </label>
      <MensagemErro>{erro}</MensagemErro>
      <div className="flex gap-2">
        <Botao type="submit" disabled={aEnviar} className="flex-1">
          {aEnviar ? 'A guardar…' : 'Guardar'}
        </Botao>
        <Botao type="button" variante="secundario" onClick={aoCancelar} className="flex-1">
          Cancelar
        </Botao>
      </div>
    </form>
  );
}

// ---------- Página principal ----------

export default function AdminConteudo() {
  const [classes, setClasses] = useState(null);
  const [erro, setErro] = useState('');

  const [classeAberta, setClasseAberta] = useState(null);
  const [unidadesPorClasse, setUnidadesPorClasse] = useState({});
  const [unidadeAberta, setUnidadeAberta] = useState(null);
  const [temasPorUnidade, setTemasPorUnidade] = useState({});

  // { nivel: 'classe' | 'unidade' | 'tema', id: número | 'nova', classeId?, unidadeId? }
  const [formAtivo, setFormAtivo] = useState(null);
  const [apagar, setApagar] = useState(null); // { tipo, id, classeId?, unidadeId?, nome }
  const [aApagar, setAApagar] = useState(false);

  useEffect(() => {
    apiAdmin.get('/admin/classes').then(setClasses).catch((e) => setErro(e.message));
  }, []);

  function carregarUnidades(classeId) {
    apiAdmin
      .get(`/admin/unidades?classe_id=${classeId}`)
      .then((lista) => setUnidadesPorClasse((prev) => ({ ...prev, [classeId]: lista })))
      .catch((e) => setErro(e.message));
  }

  function alternarClasse(id) {
    const abrir = classeAberta !== id;
    setClasseAberta(abrir ? id : null);
    setFormAtivo(null);
    if (abrir && !unidadesPorClasse[id]) carregarUnidades(id);
  }

  function carregarTemas(unidadeId) {
    apiAdmin
      .get(`/admin/temas?unidade_id=${unidadeId}`)
      .then((lista) => setTemasPorUnidade((prev) => ({ ...prev, [unidadeId]: lista })))
      .catch((e) => setErro(e.message));
  }

  function alternarUnidade(id) {
    const abrir = unidadeAberta !== id;
    setUnidadeAberta(abrir ? id : null);
    setFormAtivo(null);
    if (abrir && !temasPorUnidade[id]) carregarTemas(id);
  }

  // ----- Classe -----
  async function guardarClasse(dados, id) {
    if (id) {
      const atualizado = await apiAdmin.put(`/admin/classes/${id}`, dados);
      setClasses((cs) => cs.map((c) => (c.id === id ? atualizado : c)));
    } else {
      const criado = await apiAdmin.post('/admin/classes', dados);
      setClasses((cs) => [...(cs || []), criado]);
    }
    setFormAtivo(null);
  }

  async function apagarClasseConfirmado(id) {
    await apiAdmin.del(`/admin/classes/${id}`);
    setClasses((cs) => cs.filter((c) => c.id !== id));
  }

  // ----- Unidade -----
  async function guardarUnidade(classeId, dados, id) {
    if (id) {
      const atualizado = await apiAdmin.put(`/admin/unidades/${id}`, dados);
      setUnidadesPorClasse((prev) => ({
        ...prev,
        [classeId]: prev[classeId].map((u) => (u.id === id ? atualizado : u)),
      }));
    } else {
      const criado = await apiAdmin.post('/admin/unidades', { ...dados, classe_id: classeId });
      setUnidadesPorClasse((prev) => ({ ...prev, [classeId]: [...(prev[classeId] || []), criado] }));
    }
    setFormAtivo(null);
  }

  async function apagarUnidadeConfirmado(classeId, id) {
    await apiAdmin.del(`/admin/unidades/${id}`);
    setUnidadesPorClasse((prev) => ({ ...prev, [classeId]: prev[classeId].filter((u) => u.id !== id) }));
  }

  // ----- Tema -----
  async function guardarTema(unidadeId, dados, id) {
    if (id) {
      const atualizado = await apiAdmin.put(`/admin/temas/${id}`, dados);
      setTemasPorUnidade((prev) => ({
        ...prev,
        [unidadeId]: prev[unidadeId].map((t) => (t.id === id ? atualizado : t)),
      }));
    } else {
      const criado = await apiAdmin.post('/admin/temas', { ...dados, unidade_id: unidadeId });
      setTemasPorUnidade((prev) => ({ ...prev, [unidadeId]: [...(prev[unidadeId] || []), criado] }));
    }
    setFormAtivo(null);
  }

  async function apagarTemaConfirmado(unidadeId, id) {
    await apiAdmin.del(`/admin/temas/${id}`);
    setTemasPorUnidade((prev) => ({ ...prev, [unidadeId]: prev[unidadeId].filter((t) => t.id !== id) }));
  }

  async function confirmarApagar() {
    setAApagar(true);
    setErro('');
    try {
      const { tipo, id, classeId, unidadeId } = apagar;
      if (tipo === 'classe') await apagarClasseConfirmado(id);
      if (tipo === 'unidade') await apagarUnidadeConfirmado(classeId, id);
      if (tipo === 'tema') await apagarTemaConfirmado(unidadeId, id);
      setApagar(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setAApagar(false);
    }
  }

  const ehForm = (nivel, id, extra = {}) =>
    formAtivo?.nivel === nivel &&
    formAtivo?.id === id &&
    Object.entries(extra).every(([k, v]) => formAtivo?.[k] === v);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Conteúdo</h1>
          <p className="mt-1 text-sm text-[var(--cream-soft)]">Classes, unidades e temas — tudo sem mexer em código.</p>
        </div>
        <button
          onClick={() => setFormAtivo({ nivel: 'classe', id: 'nova' })}
          className="shrink-0 rounded-lg bg-[var(--mango)] px-3 py-2 text-sm font-bold text-[var(--mango-ink)]"
        >
          + Classe
        </button>
      </div>

      <div className="mt-3">
        <MensagemErro>{erro}</MensagemErro>
      </div>

      {ehForm('classe', 'nova') && (
        <div className="mt-4">
          <FormClasse aoSubmeter={(dados) => guardarClasse(dados)} aoCancelar={() => setFormAtivo(null)} />
        </div>
      )}

      <div className="mt-4 space-y-3">
        {classes === null && !erro && (
          <div className="animate-pulse space-y-3">
            <div className="h-16 rounded-2xl bg-black/[0.04]" />
            <div className="h-16 rounded-2xl bg-black/[0.04]" />
          </div>
        )}

        {classes?.length === 0 && (
          <p className="rounded-2xl bg-[var(--bg-soft)] p-5 text-center text-sm text-[var(--cream-soft)]">
            Ainda não há classes. Crie a primeira acima.
          </p>
        )}

        {classes?.map((c) => (
          <div key={c.id} className="rounded-2xl bg-[var(--bg-soft)] p-4">
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => alternarClasse(c.id)} className="flex-1 text-left">
                <h2 className="font-display text-lg font-semibold text-[var(--cream)]">{c.nome}</h2>
                <p className="text-xs text-[var(--cream-soft)]">
                  {classeAberta === c.id ? 'Fechar unidades ▲' : 'Ver unidades ▾'}
                </p>
              </button>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setFormAtivo({ nivel: 'classe', id: c.id })}
                  className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--cream-soft)] hover:bg-black/[0.04]"
                >
                  Editar
                </button>
                <button
                  onClick={() => setApagar({ tipo: 'classe', id: c.id, nome: c.nome })}
                  className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--brick)] hover:bg-black/[0.04]"
                >
                  Apagar
                </button>
              </div>
            </div>

            {ehForm('classe', c.id) && (
              <div className="mt-3">
                <FormClasse inicial={c} aoSubmeter={(dados) => guardarClasse(dados, c.id)} aoCancelar={() => setFormAtivo(null)} />
              </div>
            )}

            {classeAberta === c.id && (
              <div className="mt-4 space-y-3 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cream-soft)]">Unidades</p>
                  <button
                    onClick={() => setFormAtivo({ nivel: 'unidade', id: 'nova', classeId: c.id })}
                    className="text-xs font-bold text-[var(--mango)]"
                  >
                    + Unidade
                  </button>
                </div>

                {ehForm('unidade', 'nova', { classeId: c.id }) && (
                  <FormUnidade aoSubmeter={(dados) => guardarUnidade(c.id, dados)} aoCancelar={() => setFormAtivo(null)} />
                )}

                {!unidadesPorClasse[c.id] && (
                  <div className="h-12 animate-pulse rounded-xl bg-black/[0.04]" />
                )}

                {unidadesPorClasse[c.id]?.length === 0 && (
                  <p className="text-sm text-[var(--cream-soft)]">Sem unidades nesta classe ainda.</p>
                )}

                {unidadesPorClasse[c.id]?.map((u) => (
                  <div key={u.id} className="rounded-xl bg-black/[0.04] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <button onClick={() => alternarUnidade(u.id)} className="flex-1 text-left">
                        <p className="text-sm font-semibold text-[var(--cream)]">
                          {u.nome} {!u.ativo && <span className="text-[var(--brick)]">(inativa)</span>}
                        </p>
                        <p className="text-xs text-[var(--cream-soft)]">
                          {u.preco} MT · ordem {u.ordem} ·{' '}
                          {unidadeAberta === u.id ? 'fechar temas ▲' : 'ver temas ▾'}
                        </p>
                      </button>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => setFormAtivo({ nivel: 'unidade', id: u.id, classeId: c.id })}
                          className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold text-[var(--cream-soft)] hover:bg-black/5"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setApagar({ tipo: 'unidade', id: u.id, classeId: c.id, nome: u.nome })}
                          className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold text-[var(--brick)] hover:bg-black/5"
                        >
                          Apagar
                        </button>
                      </div>
                    </div>

                    {ehForm('unidade', u.id, { classeId: c.id }) && (
                      <div className="mt-3">
                        <FormUnidade
                          inicial={u}
                          aoSubmeter={(dados) => guardarUnidade(c.id, dados, u.id)}
                          aoCancelar={() => setFormAtivo(null)}
                        />
                      </div>
                    )}

                    {unidadeAberta === u.id && (
                      <div className="mt-3 space-y-2 border-t border-black/10 pt-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--cream-soft)]">Temas</p>
                          <button
                            onClick={() => setFormAtivo({ nivel: 'tema', id: 'nova', unidadeId: u.id })}
                            className="text-xs font-bold text-[var(--mango)]"
                          >
                            + Tema
                          </button>
                        </div>

                        {ehForm('tema', 'nova', { unidadeId: u.id }) && (
                          <FormTema aoSubmeter={(dados) => guardarTema(u.id, dados)} aoCancelar={() => setFormAtivo(null)} />
                        )}

                        {!temasPorUnidade[u.id] && <div className="h-10 animate-pulse rounded-lg bg-black/[0.04]" />}

                        {temasPorUnidade[u.id]?.length === 0 && (
                          <p className="text-sm text-[var(--cream-soft)]">Sem temas nesta unidade ainda.</p>
                        )}

                        {temasPorUnidade[u.id]?.map((t) => (
                          <div key={t.id}>
                            <div className="flex items-center justify-between gap-2 rounded-lg bg-black/10 px-3 py-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm text-[var(--cream)]">
                                  {t.nome} {!t.ativo && <span className="text-[var(--brick)]">(inativo)</span>}
                                </p>
                                <p className="truncate text-xs text-[var(--cream-soft)]">{t.link_youtube}</p>
                              </div>
                              <div className="flex shrink-0 gap-2">
                                <button
                                  onClick={() => setFormAtivo({ nivel: 'tema', id: t.id, unidadeId: u.id })}
                                  className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold text-[var(--cream-soft)] hover:bg-black/5"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => setApagar({ tipo: 'tema', id: t.id, unidadeId: u.id, nome: t.nome })}
                                  className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold text-[var(--brick)] hover:bg-black/5"
                                >
                                  Apagar
                                </button>
                              </div>
                            </div>
                            {ehForm('tema', t.id, { unidadeId: u.id }) && (
                              <div className="mt-2">
                                <FormTema
                                  inicial={t}
                                  aoSubmeter={(dados) => guardarTema(u.id, dados, t.id)}
                                  aoCancelar={() => setFormAtivo(null)}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {apagar && (
        <Modal
          titulo={`Apagar ${apagar.tipo === 'classe' ? 'classe' : apagar.tipo === 'unidade' ? 'unidade' : 'tema'}`}
          aoFechar={() => setApagar(null)}
          aoConfirmar={confirmarApagar}
          textoConfirmar="Apagar"
          aConfirmar={aApagar}
          perigo
        >
          Tem a certeza de que quer apagar "{apagar.nome}"?
          {apagar.tipo === 'classe' && ' Isto pode afetar as unidades e temas associados.'}
          {apagar.tipo === 'unidade' && ' Isto pode afetar os temas e acessos associados.'}
          {' '}Esta ação não pode ser desfeita.
        </Modal>
      )}
    </AdminLayout>
  );
}
