import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Botao from '../components/Botao';
import Campo from '../components/Campo';
import MensagemErro from '../components/MensagemErro';
import { useAuth } from '../context/AuthContext';

export default function Registo() {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const { registar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.depoisDe || '/';

  async function aoSubmeter(e) {
    e.preventDefault();
    setErro('');
    if (!/^\d{4}$/.test(pin)) {
      setErro('O PIN deve ter exatamente 4 dígitos.');
      return;
    }
    setAEnviar(true);
    try {
      await registar({ nome, whatsapp, pin });
      navigate(destino, { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold text-[var(--cream)]">Criar conta</h1>
      <p className="mt-1 text-sm text-[var(--cream-soft)]">
        Só precisamos do essencial — sem senhas complicadas.
      </p>

      <form onSubmit={aoSubmeter} className="mt-6 space-y-4">
        <Campo label="Nome completo">
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Ana Cossa"
            className="campo"
          />
        </Campo>
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
        <Campo label="Crie um PIN de 4 dígitos">
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
          {aEnviar ? 'A criar conta…' : 'Criar conta'}
        </Botao>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--cream-soft)]">
        Já tem conta?{' '}
        <Link to="/entrar" state={{ depoisDe: destino }} className="font-semibold text-[var(--mango)]">
          Entrar
        </Link>
      </p>
    </Layout>
  );
}
