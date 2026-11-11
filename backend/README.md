# Sala Virtual — Backend (Parte 1)

API REST em Node.js + Express + SQLite (via `better-sqlite3`) que implementa o modelo de
dados e as regras de negócio descritas na spec `prompt-sala-virtual.md`.

## Como rodar localmente

```bash
cd backend
npm install
cp .env.example .env
npm run seed     # cria o schema, 1 classe/1 unidade/3 temas de exemplo, e o admin
npm start        # ou: npm run dev (reinicia sozinho ao editar ficheiros)
```

A API sobe em `http://localhost:4000`.

**Credenciais do admin de exemplo (criadas pelo seed):**
`username: admin` / `password: admin123` — troque isto antes de ir para produção.

O ficheiro da base de dados fica em `backend/data/sala-virtual.db` (SQLite), criado
automaticamente. Para recomeçar do zero, apague essa pasta e rode `npm run seed` de novo.

## Decisões de implementação (a validar contigo)

1. **Estado "expirado" não é gravado na BD.** A spec pede que a expiração seja verificada
   por comparação de datas, sem job/cron. Implementei isso calculando o estado "visível"
   (`pendente` / `pago` / `expirado` / `rejeitado`) sempre no momento da consulta, a partir
   do estado gravado (`pendente`/`pago`/`rejeitado`) + `data_expiracao`. Isto evita
   inconsistência entre o valor gravado e a realidade, e é o que a rota
   `GET /api/admin/acessos?estado=expirado` usa para filtrar.
2. **PIN e senha de admin são guardados com hash (bcrypt)**, não em texto simples — mesmo
   sendo "sem senha forte" do lado do aluno, evitar texto puro no BD é boa prática básica
   e não complica o fluxo do aluno.
3. **Autenticação via JWT** (Bearer token) tanto para aluno como para admin, com payload
   diferenciado por `tipo` (`aluno` | `admin`), para poder reutilizar o mesmo mecanismo.
4. **Ocultação do link do YouTube:** a rota `GET /api/unidades/:id/temas` só inclui o
   campo `link_youtube` no JSON quando existe um acesso `pago` e não expirado para aquele
   aluno+unidade — nunca antes disso (conforme exigido na spec).
5. **Reordenação** de unidades/temas: adicionei `POST .../reordenar` com `{ ids: [...] }`
   (a posição no array define o novo valor de `ordem`), além de poder editar `ordem`
   diretamente no PUT de cada item.
6. **SQLite** escolhido em vez de Postgres para simplicidade de rodar localmente sem
   infraestrutura extra — a spec permitia ambos. Se preferires Postgres para produção,
   a camada de acesso a dados está isolada em `src/db.js` e nas rotas via `db.prepare(...)`,
   dá para migrar trocando o driver.

## Rotas da API

### Públicas
- `GET /api/config` — nome da escola, logo, WhatsApp do admin, duração do acesso
- `GET /api/classes` — lista de classes (com vídeo gratuito de amostra)
- `GET /api/classes/:id/unidades` — unidades ativas de uma classe (inclui `meu_acesso` se autenticado como aluno)
- `GET /api/unidades/:id/temas` — temas da unidade (link do YouTube só se houver acesso pago ativo)

### Aluno (`/api/alunos`)
- `POST /registo` — `{ nome, whatsapp, pin }`
- `POST /login` — `{ whatsapp, pin }`
- `GET /me` — dados do aluno autenticado (Bearer token)
- `GET /me/acessos` — "Minhas Unidades": histórico completo de pedidos
- `POST /me/acessos` — `{ unidade_id }` → cria pedido `pendente`, devolve código de referência e link pronto para abrir o WhatsApp do admin

### Admin (`/api/admin`) — todas exigem `Authorization: Bearer <token de admin>` exceto o login
- `POST /login` — `{ username, password }`
- CRUD completo: `/classes`, `/unidades`, `/temas` (GET, POST, PUT `:id`, DELETE `:id`)
- `POST /unidades/reordenar`, `POST /temas/reordenar` — `{ ids: [...] }`
- `GET /acessos?estado=pendente|pago|expirado|rejeitado` — lista de pedidos
- `POST /acessos/:id/confirmar` — marca como pago e calcula `data_expiracao`
- `POST /acessos/:id/rejeitar`
- `GET /alunos` — lista de alunos com histórico de unidades
- `GET /config`, `PUT /config`

## Testado manualmente

Fluxo completo testado de ponta a ponta: registo de aluno → pedido de acesso a uma
unidade → link do YouTube ausente no JSON antes da confirmação → admin confirma →
link do YouTube passa a aparecer na resposta → "Minhas Unidades" reflete o estado `pago`
com data de expiração calculada corretamente.

## Próximos passos

Parte 2 (frontend do aluno) e Parte 3 (painel admin), conforme combinado.
