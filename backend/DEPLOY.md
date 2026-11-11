# Publicar a Segredos da Física de graça (sem VPS, sem domínio)

Stack final, tudo gratuito:

- **Base de dados** — Postgres no Supabase (já tens conta)
- **Backend** — Render, Web Service (plano Free) → `https://sala-virtual-backend.onrender.com`
- **Frontend** — Render, Static Site (plano Free) → `https://sala-virtual-frontend.onrender.com`

## 1. Ir buscar a connection string ao Supabase

No painel do Supabase: **Project Settings → Database → Connection string → URI**.
Copia o valor (algo como `postgresql://postgres:xxxxx@db.xxxxx.supabase.co:5432/postgres`).
Guarda-o — vais precisar dele já a seguir.

## 2. Subir o projeto para o GitHub

Se ainda não estiver num repositório:

```bash
git init
git add .
git commit -m "Segredos da Física - Postgres + deploy gratuito"
git branch -M main
git remote add origin https://github.com/teu-user/sala-virtual.git
git push -u origin main
```

## 3. Deploy no Render via Blueprint

1. Em [render.com](https://render.com) → **New → Blueprint**.
2. Escolhe o repositório. O Render vai ler o `render.yaml` que já está na raiz do projeto e propor **dois serviços**: `sala-virtual-backend` e `sala-virtual-frontend`.
3. Quando pedir o valor de `DATABASE_URL`, cola a connection string do Supabase (passo 1).
4. Confirma. O Render faz o build e o deploy dos dois serviços automaticamente.

Ao fim de alguns minutos vais ter:
- Backend em algo como `https://sala-virtual-backend.onrender.com`
- Frontend em algo como `https://sala-virtual-frontend.onrender.com`

(Se o Render atribuir nomes ligeiramente diferentes por já existirem serviços com esse nome, confirma o URL real do backend no dashboard e atualiza a variável `VITE_API_URL` do serviço frontend para `https://<nome-real-do-backend>.onrender.com/api`, depois faz "Manual Deploy" no frontend.)

## 4. Popular a base de dados (uma vez)

O backend cria as tabelas sozinho ao arrancar (`db.migrate()`), mas o **seed** (as classes/unidades/temas e o admin de exemplo) corre à parte. Da tua máquina:

```bash
cd backend
DATABASE_URL="postgresql://postgres:...@db....supabase.co:5432/postgres" npm run seed
```

Isto vai imprimir `Admin criado -> username: admin | password: admin123`. **Troca esta password depois**, criando um novo admin ou editando a tabela `admins` diretamente no editor de tabelas do Supabase.

Se também usas o script da 9ª classe:

```bash
DATABASE_URL="postgresql://postgres:...@db....supabase.co:5432/postgres" node src/add-9classe.js
```

## 5. Testar

- `https://sala-virtual-backend.onrender.com/api/health` → deve responder `{"ok":true}`
- Abrir o frontend no browser e testar registo/login de aluno e login de admin.

## Notas importantes do plano gratuito

- **Render free**: o backend "adormece" depois de ~15 min sem pedidos, e demora uns 30-50 segundos a "acordar" no pedido seguinte. É normal — não é bug. Não há como evitar isto sem pagar, mas os dados nunca se perdem (estão no Supabase, não no Render).
- **Supabase free**: o projeto pode pausar-se sozinho depois de ~1 semana sem atividade nenhuma. Basta abrir o painel do Supabase e clicar em "restore"/"resume" — os dados continuam lá.
- Nenhum destes serviços exige cartão de crédito nem domínio próprio para o plano gratuito.
