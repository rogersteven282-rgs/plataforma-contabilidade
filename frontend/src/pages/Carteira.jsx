import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carteira() {
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const alunoData = localStorage.getItem('aluno');
    if (!alunoData) {
      navigate('/login');
      return;
    }
    setAluno(JSON.parse(alunoData));
  }, [navigate]);

  async function handleComprar(pacote) {
    setLoading(true);
    setMensagem('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:4000/api/pagamentos/comprar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ pacote_id: pacote.id })
      });
      
      const data = await res.json();
      
      if (data.erro) throw new Error(data.erro);
      
      // Simulação de pagamento M-Pesa bem-sucedido
      setTimeout(() => {
        const novoAluno = { ...aluno, creditos: aluno.creditos + pacote.creditos };
        localStorage.setItem('aluno', JSON.stringify(novoAluno));
        setAluno(novoAluno);
        setMensagem(`✅ Pagamento de ${pacote.preco} MZN confirmado via M-Pesa! Ganhaste +${pacote.creditos} créditos.`);
        setLoading(false);
      }, 1500);

    } catch (err) {
      setMensagem(`❌ Erro: ${err.message}`);
      setLoading(false);
    }
  }

  if (!aluno) return null;

  const pacotes = [
    { id: 1, nome: 'Pacote Básico', creditos: 250, preco: 250, bonus: 0 },
    { id: 2, nome: 'Pacote Médio', creditos: 500, preco: 500, bonus: 60, destaque: true },
    { id: 3, nome: 'Passe Mensal', creditos: 1500, preco: 1000, bonus: 500 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 p-6 rounded-2xl shadow-sm" style={{ background: 'var(--paper)' }}>
          <div>
            <h1 className="text-2xl font-bold">A Minha Carteira</h1>
            <p className="font-semibold mt-1" style={{ color: 'var(--teal)' }}>Saldo Atual: {aluno.creditos} Créditos</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm font-bold px-4 py-2 rounded-lg" style={{ color: 'var(--mango)', background: 'var(--mango-soft)' }}>
            Voltar
          </button>
        </header>

        {mensagem && (
          <div className="mb-6 p-4 rounded-xl font-medium" style={{ background: mensagem.includes('✅') ? 'var(--teal-soft)' : 'var(--brick-soft)', color: mensagem.includes('✅') ? 'var(--teal)' : 'var(--brick)' }}>
            {mensagem}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pacotes.map(p => (
            <div key={p.id} className={`p-6 rounded-2xl shadow-sm border-2 ${p.destaque ? 'border-[var(--mango)]' : 'border-transparent'}`} style={{ background: 'var(--paper)' }}>
              {p.destaque && <span className="text-xs font-bold px-2 py-1 rounded mb-2 inline-block" style={{ background: 'var(--mango-soft)', color: 'var(--mango)' }}>O mais popular</span>}
              <h2 className="text-xl font-bold mb-2">{p.nome}</h2>
              <p className="text-3xl font-bold mb-4">{p.preco} <span className="text-sm font-normal">MZN</span></p>
              <p className="mb-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
                Recebes <strong>{p.creditos + p.bonus} créditos</strong> {p.bonus > 0 && <span style={{ color: 'var(--teal)' }}>(+{p.bonus} de bónus)</span>}
              </p>
              <button 
                onClick={() => handleComprar(p)} 
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'var(--mango)', color: 'var(--mango-ink)' }}
              >
                {loading ? 'A processar...' : 'Pagar com M-Pesa'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
