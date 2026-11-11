import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CriarEmpresa() {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [tipoSociedade, setTipoSociedade] = useState('Lda');
  const [capital, setCapital] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleCriar(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:4000/api/empresa/criar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          nome_empresa: nomeEmpresa, 
          tipo_sociedade: tipoSociedade, 
          capital_social: Number(capital) 
        })
      });
      
      const data = await res.json();
      if (data.erro) throw new Error(data.erro);
      
      // Atualizar os créditos no localStorage (Bónus de +5)
      const aluno = JSON.parse(localStorage.getItem('aluno'));
      aluno.creditos += 5;
      localStorage.setItem('aluno', JSON.stringify(aluno));
      
      navigate('/dashboard');
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <form onSubmit={handleCriar} className="w-full max-w-md p-8 rounded-2xl shadow-sm" style={{ background: 'var(--paper)' }}>
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--ink)' }}>Registo da Empresa</h1>
        
        {erro && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--brick-soft)', color: 'var(--brick)' }}>
            {erro}
          </div>
        )}
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Nome da Empresa" 
            className="campo" 
            value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)} 
          />
          <select className="campo" value={tipoSociedade} onChange={e => setTipoSociedade(e.target.value)}>
            <option value="Lda">Sociedade por Quotas (Lda)</option>
            <option value="Unipessoal">Unipessoal Lda</option>
            <option value="Anonima">Sociedade Anónima</option>
          </select>
          <input 
            type="number" placeholder="Capital Social (MZN)" 
            className="campo" 
            value={capital} onChange={e => setCapital(e.target.value)} 
          />
        </div>
        
        <button type="submit" className="w-full mt-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90" style={{ background: 'var(--mango)', color: 'var(--mango-ink)' }}>
          Confirmar Registo
        </button>
      </form>
    </div>
  );
}
