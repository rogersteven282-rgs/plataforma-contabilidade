import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Botao from '../components/Botao';
import Campo from '../components/Campo';
import MensagemErro from '../components/MensagemErro';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [whatsapp, setWhatsapp] = useState('');
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.depoisDe || '/';

  async function aoSubmeter(e) {
    e.preventDefault();
    setErro('');
    setAEnviar(true);
    try {
      await entrar({ whatsapp, pin });
      navigate(destino, { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Entrar</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">Use o WhatsApp e o PIN que registou.</p>

      <form onSubmit={aoSubmeter} className="mt-6 space-y-4">
        <Campo label="Número de WhatsApp">
          <input
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Ex: 84 123 4567"
            inputMode="tel"
            className="campo"
          />
        </Campo>
        <Campo label="PIN">
          <input
            required
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="••••"
            inputMode="numeric"
            maxLength={4}
            className="campo font-mono-ref tracking-[0.5em]"
          />
        </Campo>

        <MensagemErro>{erro}</MensagemErro>

        <Botao type="submit" disabled={aEnviar}>
          {aEnviar ? 'A entrar…' : 'Entrar'}
        </Botao>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--cream-soft)]">
        Ainda não tem conta?{' '}
        <Link to="/registo" state={{ depoisDe: destino }} className="font-semibold text-[var(--mango)]">
          Criar conta
        </Link>
      </p>
    </Layout>
  );
}
