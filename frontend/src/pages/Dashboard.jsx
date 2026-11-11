import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [aluno, setAluno] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const alunoData = localStorage.getItem('aluno');
    
    if (!token || !alunoData) {
      navigate('/login');
      return;
    }
    
    setAluno(JSON.parse(alunoData));

    fetch('http://localhost:4000/api/empresa/minha-empresa', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (!data.erro) setEmpresa(data);
    });
  }, [navigate]);

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  if (!aluno) return null;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 rounded-2xl shadow-sm gap-4" style={{ background: 'var(--paper)' }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Olá, {aluno.nome}!</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="font-semibold" style={{ color: 'var(--teal)' }}>Saldo: {aluno.creditos} Créditos</p>
              <button onClick={() => navigate('/carteira')} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}>
                + Comprar Créditos
              </button>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm font-bold px-4 py-2 rounded-lg transition-colors" style={{ color: 'var(--brick)', background: 'var(--brick-soft)' }}>
            Sair
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl shadow-sm border-t-4" style={{ background: 'var(--paper)', borderColor: 'var(--mango)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>A Minha Empresa</h2>
            {empresa ? (
              <div>
                <p className="mb-2" style={{ color: 'var(--ink)' }}><strong>Nome:</strong> {empresa.nome_empresa}</p>
                <p className="mb-2" style={{ color: 'var(--ink)' }}><strong>Tipo:</strong> {empresa.tipo_sociedade}</p>
                <p className="mb-4" style={{ color: 'var(--ink)' }}><strong>Capital:</strong> {empresa.capital_social} MZN</p>
                <button className="w-full py-3 rounded-xl font-bold" style={{ background: 'var(--mango-soft)', color: 'var(--mango)' }}>
                  Entrar na Empresa
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4" style={{ color: 'var(--ink-soft)' }}>Ainda não criaste a tua empresa. Esta é a primeira missão do Nível 3.</p>
                <button onClick={() => navigate('/criar-empresa')} className="w-full py-3 rounded-xl font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--teal)', color: 'var(--mango-ink)' }}>
                  Criar Empresa
                </button>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl shadow-sm border-t-4" style={{ background: 'var(--paper)', borderColor: 'var(--teal)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Tutor de IA</h2>
            <p className="mb-4" style={{ color: 'var(--ink-soft)' }}>Tens dúvidas de contabilidade? Fala com o teu mentor IA.</p>
            <button onClick={() => navigate('/tutor')} className="w-full py-3 rounded-xl font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--mango)', color: 'var(--mango-ink)' }}>
              Falar com o Tutor
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
