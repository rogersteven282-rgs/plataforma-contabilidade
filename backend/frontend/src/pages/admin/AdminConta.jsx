import { useState } from 'react';
import { apiAdmin } from '../../api/client';
import AdminLayout from '../../components/admin/AdminLayout';
import Botao from '../../components/Botao';
import Campo from '../../components/Campo';
import MensagemErro from '../../components/MensagemErro';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminConta() {
  const { admin, setAdmin } = useAdminAuth();
  const [passwordAtual, setPasswordAtual] = useState('');
  const [novoUsername, setNovoUsername] = useState(admin?.username || '');
  const [novaPassword, setNovaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (novaPassword && novaPassword !== confirmarPassword) {
      setErro('A nova password e a confirmação não coincidem.');
      return;
    }

    setAGuardar(true);
    try {
      const resposta = await apiAdmin.put('/admin/me', {
        passwordAtual,
        novoUsername,
        novaPassword: novaPassword || undefined,
      });
      setAdmin?.(resposta.admin);
      setSucesso(true);
      setPasswordAtual('');
      setNovaPassword('');
      setConfirmarPassword('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Conta</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">
        Troca o teu username e/ou password de acesso ao painel de admin.
      </p>

      {erro && (
        <div className="mt-4">
          <MensagemErro>{erro}</MensagemErro>
        </div>
      )}

      <form onSubmit={guardar} className="mt-5 max-w-md space-y-4">
        <Campo label="Novo username">
          <input
            required
            value={novoUsername}
            onChange={(e) => setNovoUsername(e.target.value)}
            className="campo"
          />
        </Campo>

        <Campo label="Nova password (deixa em branco para não trocar)">
          <input
            type="password"
            value={novaPassword}
            onChange={(e) => setNovaPassword(e.target.value)}
            placeholder="••••"
            className="campo"
          />
        </Campo>

        {novaPassword && (
          <Campo label="Confirmar nova password">
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="••••"
              className="campo"
            />
          </Campo>
        )}

        <Campo label="Password atual (obrigatória para confirmar)">
          <input
            required
            type="password"
            value={passwordAtual}
            onChange={(e) => setPasswordAtual(e.target.value)}
            placeholder="••••"
            className="campo"
          />
        </Campo>

        {sucesso && (
          <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}>
            Dados da conta atualizados.
          </p>
        )}

        <Botao type="submit" disabled={aGuardar}>
          {aGuardar ? 'A guardar…' : 'Guardar alterações'}
        </Botao>
      </form>
    </AdminLayout>
  );
}
