import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TutorIA() {
  const [pergunta, setPergunta] = useState('');
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleEnviar(e) {
    e.preventDefault();
    if (!pergunta.trim()) return;

    const novaPergunta = pergunta;
    setPergunta('');
    setHistorico(prev => [...prev, { tipo: 'user', texto: novaPergunta }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/ia/perguntar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ pergunta: novaPergunta })
      });
      
      const data = await res.json();
      
      if (data.erro) {
        setHistorico(prev => [...prev, { tipo: 'erro', texto: data.erro }]);
      } else {
        setHistorico(prev => [...prev, { tipo: 'ia', texto: data.resposta }]);
        
        // Atualizar os créditos localmente
        if (data.creditos_restantes !== undefined) {
          const aluno = JSON.parse(localStorage.getItem('aluno'));
          aluno.creditos = data.creditos_restantes;
          localStorage.setItem('aluno', JSON.stringify(aluno));
        }
      }
    } catch (err) {
      setHistorico(prev => [...prev, { tipo: 'erro', texto: 'Erro de ligação ao tutor.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Tutor de Contabilidade IA</h1>
          <button onClick={() => navigate('/dashboard')} className="text-sm font-bold px-4 py-2 rounded-lg" style={{ color: 'var(--mango)', background: 'var(--mango-soft)' }}>
            Voltar ao Dashboard
          </button>
        </header>

        <main className="flex-1 overflow-y-auto mb-4 p-4 rounded-2xl shadow-sm space-y-4" style={{ background: 'var(--paper)' }}>
          {historico.length === 0 && (
            <p className="text-center mt-10" style={{ color: 'var(--ink-soft)' }}>Faz a tua primeira pergunta ao tutor.</p>
          )}
          {historico.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[80%] p-3 rounded-xl" style={{
                background: msg.tipo === 'user' ? 'var(--mango)' : (msg.tipo === 'erro' ? 'var(--brick-soft)' : 'var(--paper-soft)'),
                color: msg.tipo === 'user' ? 'var(--mango-ink)' : (msg.tipo === 'erro' ? 'var(--brick)' : 'var(--ink)'),
              }}>
                {msg.texto}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-xl" style={{ background: 'var(--paper-soft)', color: 'var(--ink-soft)' }}>
                A pensar...
              </div>
            </div>
          )}
        </main>

        <form onSubmit={handleEnviar} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ex: O que é um lançamento a débito?" 
            className="campo flex-1" 
            value={pergunta} 
            onChange={e => setPergunta(e.target.value)} 
            disabled={loading}
          />
          <button type="submit" className="px-6 rounded-xl font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--teal)', color: 'var(--mango-ink)' }} disabled={loading}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
