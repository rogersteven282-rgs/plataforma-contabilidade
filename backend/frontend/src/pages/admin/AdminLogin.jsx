import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Botao from '../../components/Botao';
import Campo from '../../components/Campo';
import MensagemErro from '../../components/MensagemErro';
import Footer from '../../components/Footer';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const { admin, entrar } = useAdminAuth();
  const navigate = useNavigate();

  if (admin) return <Navigate to="/admin/pedidos" replace />;

  async function aoSubmeter(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      await entrar({ username, password });
      navigate('/admin/pedidos', { replace: true });
    } catch (e) {
      setErro(e.status === 401 ? 'Usuário ou senha inválidos.' : e.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--mango)] font-display text-base font-bold text-[var(--mango-ink)]">
            SV
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Painel Admin</h1>
          <p className="text-sm text-[var(--cream-soft)]">Segredos da Física — acesso reservado ao professor</p>
        </div>

        <form onSubmit={aoSubmeter} className="space-y-4">
          <Campo label="Usuário">
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="campo"
            />
          </Campo>
          <Campo label="Senha">
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="campo"
            />
          </Campo>

          <MensagemErro>{erro}</MensagemErro>

          <Botao type="submit" disabled={aEnviar}>
            {aEnviar ? 'A entrar…' : 'Entrar'}
          </Botao>
        </form>
      </div>
      <Footer />
    </div>
  );
}
