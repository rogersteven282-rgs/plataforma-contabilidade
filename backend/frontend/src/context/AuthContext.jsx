import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [aluno, setAluno] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarAluno = useCallback(async () => {
    if (!getToken()) {
      setAluno(null);
      setCarregando(false);
      return;
    }
    try {
      const dados = await api.get('/alunos/me');
      setAluno(dados);
    } catch {
      setToken(null);
      setAluno(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarAluno();
  }, [carregarAluno]);

  const registar = async ({ nome, whatsapp, pin }) => {
    const dados = await api.post('/alunos/registo', { nome, whatsapp, pin });
    setToken(dados.token);
    setAluno(dados.aluno);
    return dados.aluno;
  };

  const entrar = async ({ whatsapp, pin }) => {
    const dados = await api.post('/alunos/login', { whatsapp, pin });
    setToken(dados.token);
    setAluno(dados.aluno);
    return dados.aluno;
  };

  const sair = () => {
    setToken(null);
    setAluno(null);
  };

  return (
    <AuthContext.Provider value={{ aluno, carregando, registar, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
