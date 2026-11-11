const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'sala-virtual:token';
const ADMIN_TOKEN_KEY = 'sala-virtual:admin-token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Regista um callback chamado sempre que uma chamada autenticada do admin
// receber 401 (sessão inválida/expirada) — o AdminAuthContext usa isto para
// limpar o estado e mandar de volta para o login sem cada página ter de o
// tratar individualmente.
let aoAdminFicarNaoAutorizado = null;
export function definirCallbackAdminNaoAutorizado(fn) {
  aoAdminFicarNaoAutorizado = fn;
}

async function pedido(caminho, opcoes = {}, contexto = 'aluno') {
  const ehAdmin = contexto === 'admin';
  const token = ehAdmin ? getAdminToken() : getToken();
  const headers = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });

  let corpo = null;
  const texto = await res.text();
  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch {
      corpo = null;
    }
  }

  if (res.status === 401 && ehAdmin) {
    setAdminToken(null);
    aoAdminFicarNaoAutorizado?.();
  }

  if (!res.ok) {
    const mensagem = corpo?.erro || `Erro ${res.status} ao comunicar com o servidor`;
    const erro = new Error(mensagem);
    erro.status = res.status;
    erro.corpo = corpo;
    throw erro;
  }

  return corpo;
}

export const api = {
  get: (caminho) => pedido(caminho, { method: 'GET' }),
  post: (caminho, dados) => pedido(caminho, { method: 'POST', body: JSON.stringify(dados) }),
  put: (caminho, dados) => pedido(caminho, { method: 'PUT', body: JSON.stringify(dados) }),
  del: (caminho) => pedido(caminho, { method: 'DELETE' }),
};

// Mesma interface que `api`, mas autentica com o token do admin e despoleta
// o callback de sessão expirada em vez do fluxo de sessão do aluno.
export const apiAdmin = {
  get: (caminho) => pedido(caminho, { method: 'GET' }, 'admin'),
  post: (caminho, dados) => pedido(caminho, { method: 'POST', body: JSON.stringify(dados) }, 'admin'),
  put: (caminho, dados) => pedido(caminho, { method: 'PUT', body: JSON.stringify(dados) }, 'admin'),
  del: (caminho) => pedido(caminho, { method: 'DELETE' }, 'admin'),
};
