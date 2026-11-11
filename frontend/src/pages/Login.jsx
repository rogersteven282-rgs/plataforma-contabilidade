import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [whatsapp, setWhatsapp] = useState('');
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp, pin })
      });
      
      const data = await res.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('aluno', JSON.stringify(data.aluno));
        navigate('/dashboard');
      } else {
        setErro(data.erro || 'Erro ao entrar');
      }
    } catch (err) {
      setErro('Erro de ligação ao servidor.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 rounded-2xl shadow-sm" style={{ background: 'var(--paper)' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--ink)' }}>Contabilidade IA</h1>
          <p className="mt-2" style={{ color: 'var(--ink-soft)' }}>Aprende na prática, com o teu mentor.</p>
        </div>

        {erro && (
          <div className="mb-6 p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--brick-soft)', color: 'var(--brick)' }}>
            {erro}
          </div>
        )}
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Número de WhatsApp" 
            className="campo" 
            value={whatsapp} onChange={e => setWhatsapp(e.target.value)} 
          />
          <input 
            type="password" placeholder="PIN (4 dígitos)" 
            className="campo" 
            value={pin} onChange={e => setPin(e.target.value)} 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full mt-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
          style={{ background: 'var(--mango)', color: 'var(--mango-ink)' }}
        >
          Entrar na Plataforma
        </button>
      </form>
    </div>
  );
}
