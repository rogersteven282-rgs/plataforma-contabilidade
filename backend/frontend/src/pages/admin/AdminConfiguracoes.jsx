import { useEffect, useState } from 'react';
import { apiAdmin } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import Botao from '../../components/Botao';
import Campo from '../../components/Campo';
import MensagemErro from '../../components/MensagemErro';

export default function AdminConfiguracoes() {
  const [form, setForm] = useState(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    apiAdmin
      .get('/admin/config')
      .then(setForm)
      .catch((e) => setErro(e.message));
  }, []);

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setSucesso(false);
  }

  async function guardar(e) {
    e.preventDefault();
    setErro('');
    setAGuardar(true);
    try {
      const atualizado = await apiAdmin.put('/admin/config', {
        ...form,
        duracao_acesso_dias: Number(form.duracao_acesso_dias),
      });
      setForm(atualizado);
      setSucesso(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Configurações</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">Dados gerais que aparecem para os alunos.</p>

      {erro && (
        <div className="mt-4">
          <MensagemErro>{erro}</MensagemErro>
        </div>
      )}

      {form && (
        <form onSubmit={guardar} className="mt-5 max-w-md space-y-4">
          <Campo label="Nome da escola / curso">
            <input
              required
              value={form.nome_escola || ''}
              onChange={(e) => atualizar('nome_escola', e.target.value)}
              className="campo"
            />
          </Campo>
          <Campo label="URL do logótipo (opcional)">
            <input
              value={form.logo_url || ''}
              onChange={(e) => atualizar('logo_url', e.target.value)}
              placeholder="https://…"
              className="campo"
            />
          </Campo>
          <Campo label="WhatsApp de contacto (com código do país)">
            <input
              required
              value={form.whatsapp_admin || ''}
              onChange={(e) => atualizar('whatsapp_admin', e.target.value)}
              placeholder="258 84 123 4567"
              inputMode="tel"
              className="campo"
            />
          </Campo>
          <Campo label="Duração do acesso (dias)">
            <input
              required
              type="number"
              min="1"
              value={form.duracao_acesso_dias ?? ''}
              onChange={(e) => atualizar('duracao_acesso_dias', e.target.value)}
              className="campo"
            />
          </Campo>

          {sucesso && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}>
              Configurações guardadas.
            </p>
          )}

          <Botao type="submit" disabled={aGuardar}>
            {aGuardar ? 'A guardar…' : 'Guardar alterações'}
          </Botao>
        </form>
      )}
    </AdminLayout>
  );
}
