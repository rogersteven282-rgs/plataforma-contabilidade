const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function login(whatsapp, pin) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsapp, pin })
  });
  return res.json();
}

export async function registar(nome, whatsapp, pin) {
  const res = await fetch(`${API_URL}/auth/registo-aluno`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, whatsapp, pin })
  });
  return res.json();
}

export async function perguntarIA(pergunta, token) {
  const res = await fetch(`${API_URL}/ia/perguntar`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ pergunta })
  });
  return res.json();
}
