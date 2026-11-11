# Segredos da Físuca — Frontend (Parte 2: Aluno + Parte 3: Admin)

React + Vite + Tailwind CSS (v4) + React Router. Cobre todo o fluxo do aluno descrito na
spec: landing pública, registo/login, navegação por classe → unidade → temas, pedido de
acesso via WhatsApp, e "Minhas Unidades".

## Como rodar localmente

Precisa do **backend da Parte 1 a correr** (`http://localhost:4000` por default).

```bash
# Terminal 1 — backend
cd backend
npm install && npm run seed && npm start

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env      # ajuste VITE_API_URL se o backend não estiver em localhost:4000
npm run dev
```

Abra `http://localhost:5173`. Mobile-first — experimente também com as devtools em modo
responsivo (o layout tem largura máxima de leitura e navegação inferior fixa, pensada para
ecrã de telemóvel).

## Direção de design

Pensei o visual a partir do contexto real: alunos moçambicanos do secundário, a estudar
pelo telemóvel, a pagar por M-Pesa/e-Mola e a confirmar por WhatsApp — ou seja, uma
experiência que já é, na prática, feita de "talões" e comprovativos.

- **Paleta** — fundo azul-noite profundo (`#101B2D`, capa de caderno ao entardecer),
  cartões em tom de papel de caderno (`#FBF7EE`), acento principal em mango/dourado
  (`#E69A28`, evocando capulana e sol) e um verde-azulado (`#1F7A6C`) reservado para
  acesso pago/ativo — deliberadamente distinto do terracota + creme que se tornou "óbvio"
  em interfaces geradas por IA.
- **Tipografia** — títulos em Fraunces (serifada, com carácter, mas não fria), texto em
  Public Sans (muito legível, boa cobertura de acentuação em português) e os códigos de
  referência (`SV-XXXX`) em IBM Plex Mono, para lerem como um número de talão.
- **Elemento-assinatura: o "bilhete de acesso"** (`TicketCard`) — cada pedido de acesso é
  mostrado como um talão com borda perfurada e uma aba destacável para "Pagar no
  WhatsApp". Isto não é decoração: o código de referência já funciona, na vida real, como
  o identificador de um comprovativo — o design só torna essa metáfora explícita.
- **Navegação inferior fixa** (Início / Minhas Unidades / Perfil) — replica um padrão que
  o público-alvo já conhece de apps como o WhatsApp, em vez de um menu de topo.

## Estrutura

```
src/
  api/client.js          — wrapper fetch com token Bearer automático
  context/AuthContext.jsx    — sessão do aluno (registo/login/logout)
  context/ConfigContext.jsx  — config pública (nome da escola, WhatsApp do admin)
  components/            — Layout, Header, BottomNav, TicketCard, StatusBadge, Botao, Campo
  pages/
    Home.jsx              — landing + lista de classes + vídeo gratuito
    Registo.jsx / Login.jsx
    ClasseUnidades.jsx     — unidades de uma classe (com estado de acesso se autenticado)
    UnidadeTemas.jsx       — temas da unidade; pede acesso; abre WhatsApp; links só após pago
    MinhasUnidades.jsx     — histórico de pedidos como bilhetes
    Perfil.jsx
```

## Decisões de implementação

1. **O link do YouTube nunca chega ao frontend antes de tempo** — isto já é garantido pelo
   backend (a rota só inclui `link_youtube` no JSON quando há acesso pago e ativo), então o
   frontend simplesmente reflete o que recebe: mostra os nomes dos temas em modo "bloqueado"
   quando `tem_acesso` é `false`.
2. **Renovação de acesso expirado** reutiliza o mesmo botão/rota de pedir acesso — o backend
   já permite um novo pedido quando o acesso anterior está expirado ou foi rejeitado.
3. **PIN e WhatsApp** ficam guardados apenas como token JWT no `localStorage` do browser do
   aluno (chave `sala-virtual:token`) — não há dados sensíveis guardados no frontend.
4. Não incluí o painel admin aqui de propósito — fica para a Parte 3, conforme combinado.

## Parte 3 — Painel Admin

Vive na mesma app React, a partir de `/admin`, com sessão própria (token guardado
separadamente em `sala-virtual:admin-token`, nunca partilhado com a sessão do aluno).

```
src/
  context/AdminAuthContext.jsx   — sessão do admin (login/logout), com deteção de 401
  components/admin/
    AdminLayout.jsx               — cabeçalho + abas (Pedidos / Conteúdo / Alunos / Configurações)
    ProtectedAdminRoute.jsx       — redireciona para /admin/entrar sem sessão
    Modal.jsx                     — confirmação para ações destrutivas (apagar/rejeitar)
  pages/admin/
    AdminLogin.jsx        — /admin/entrar
    AdminPedidos.jsx       — /admin/pedidos — filtra por estado, confirma/rejeita
    AdminConteudo.jsx      — /admin/conteudo — CRUD encadeado: Classe → Unidades → Temas,
                              reordenar por campo "ordem", ativar/desativar unidade
    AdminAlunos.jsx         — /admin/alunos — lista + histórico de acessos por aluno
    AdminConfiguracoes.jsx  — /admin/configuracoes — nome da escola, logo, WhatsApp, duração do acesso
```

### Contrato de API — confirmado por testes de integração

O painel admin foi testado ponta-a-ponta contra o backend real da Parte 1 (login,
CRUD de classes/unidades/temas, confirmar/rejeitar pedidos, configurações, listagem de
alunos com histórico) e os dois lados batem certo. Pontos que exigiram ajuste no
frontend para alinhar com o backend tal como ele foi implementado:

- Login do admin usa `{ username, password }` (não `usuario/senha`).
- Confirmar/rejeitar pedidos são `POST /admin/acessos/:id/confirmar` e
  `POST /admin/acessos/:id/rejeitar` (não `PUT`).
- `GET /admin/acessos` devolve `estado` (valor gravado) **e** `estado_visivel`
  (calculado a partir de `data_expiracao`, já que "expirado" nunca é gravado na BD) — o
  frontend mostra sempre `estado_visivel`.
- `GET /admin/alunos` devolve o histórico de cada aluno no campo `historico` (não `acessos`).
- Temas também têm campo `ativo` (tal como as unidades) — o formulário de tema já inclui
  esse toggle.

Rotas de reordenação (`POST /admin/unidades/reordenar`, `POST /admin/temas/reordenar`)
existem no backend mas ainda não têm UI de arrastar-para-reordenar no admin — por agora
reordena-se editando o campo "Ordem" em cada item.

### Assinatura da marca

Todas as páginas (aluno e admin) mostram **"Powered by SmartMetrics"** no rodapé, via o
componente partilhado `src/components/Footer.jsx`.

## Por rodar / próximos passos

Fluxo ponta-a-ponta já testado (registo → pedido → confirmação → vídeo liberado → CRUD
de conteúdo → configurações). Falta apenas: UI de reordenar por arrastar (o backend já
suporta), e trocar a credencial de admin de exemplo (`admin` / `admin123`) antes de ir
para produção.
