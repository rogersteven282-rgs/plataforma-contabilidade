import { createContext, useContext, useEffect, useState } from 'react';
import {
  apiAdmin,
  getAdminToken,
  setAdminToken,
  definirCallbackAdminNaoAutorizado,
} from '../api/client';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  // Sem endpoint "/admin/me" na spec original — se há token guardado,
  // assumimos sessão válida de forma optimista; qualquer 401 numa chamada
  // real (via apiAdmin) dispara o callback abaixo e desloga de imediato.
  const [admin, setAdmin] = useState(() => (getAdminToken() ? {} : null));

  useEffect(() => {
    definirCallbackAdminNaoAutorizado(() => setAdmin(null));
    return () => definirCallbackAdminNaoAutorizado(null);
  }, []);

  const entrar = async ({ username, password }) => {
    const dados = await apiAdmin.post('/admin/login', { username, password });
    setAdminToken(dados.token);
    setAdmin(dados.admin || { username });
    return dados.admin;
  };

  const sair = () => {
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, entrar, sair }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth deve ser usado dentro de <AdminAuthProvider>');
  return ctx;
}
