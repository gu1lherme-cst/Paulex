# Paulex Armarinho — backend com Supabase

Guia completo para colocar o banco de dados real no ar e publicar o site
atualizado. Escrito para ser seguido do computador, celular ou **iPad**,
usando só o navegador (Safari/Chrome) — sem precisar instalar nada.

## Visão geral da arquitetura

```
┌─────────────────────┐        ┌──────────────────────────┐
│   Navegador do       │  HTTPS │       Supabase            │
│   cliente / admin    │◄──────►│  Postgres + Auth + RLS    │
│  (site estático,      │        │  (categories, products,   │
│   GitHub Pages)       │        │   orders, order_items,    │
└─────────────────────┘        │   admin_users)            │
                                 └──────────────────────────┘
```

- O **frontend** (React + Vite) continua 100% estático, publicado pelo
  GitHub Actions no **GitHub Pages** — não é preciso Node/servidor próprio.
- O **Supabase** faz o papel de backend: banco Postgres, autenticação (login
  do admin) e regras de segurança (RLS), tudo acessado direto do navegador
  via `@supabase/supabase-js`.
- A **`anon key`** do Supabase é pública por design (fica no bundle do
  site) — quem protege os dados são as políticas de RLS, não o sigilo dessa
  chave. A **`service_role key`** (essa sim secreta) nunca é usada no
  frontend.

## Passo a passo

### 1. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (dá para
   entrar com GitHub).
2. Clique em **New project**, escolha um nome (ex.: `paulex-armarinho`) e
   uma senha para o banco (guarde-a, mas ela não será usada pelo site).
3. Aguarde o projeto ficar pronto (1–2 minutos).
4. No menu lateral, vá em **Project Settings → API**. Copie:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (uma chave longa)

### 2. Criar as tabelas e as regras de segurança

No menu lateral, abra **SQL Editor → New query**. Cole e rode, **um
arquivo por vez, nesta ordem**:

1. `supabase/01_schema.sql` — cria as tabelas.
2. `supabase/02_policies.sql` — ativa a segurança (RLS) e as regras de quem
   pode ler/escrever cada tabela.
3. `supabase/03_seed_categories.sql` — cadastra as 8 categorias que a loja
   já usa hoje (Papelaria, Utilidades, Brinquedos, etc.).

Depois de cada um, clique em **Run** e confira que apareceu "Success" (sem
erro vermelho) antes de colar o próximo.

### 3. Cadastrar você como administrador

Ainda no **SQL Editor**, rode (troque pelo seu e-mail real):

```sql
insert into admin_users (email, role)
values ('SEU-EMAIL@exemplo.com', 'admin');
```

Esse é o e-mail que você vai usar para entrar em `/#/admin`. O login é por
**link mágico**: você digita o e-mail no site, recebe um link por e-mail e
clica para entrar — não tem senha para lembrar.

> Para adicionar outro administrador no futuro, repita este `insert` com o
> e-mail da pessoa (só quem já está nesta tabela consegue usar o painel).

### 4. Conectar o GitHub ao Supabase (variáveis de ambiente)

No repositório do GitHub (`gu1lherme-cst/Paulex`):

1. Vá em **Settings → Secrets and variables → Actions**.
2. Clique em **New repository secret** e crie:
   - `SUPABASE_URL` = a Project URL copiada no passo 1.
   - `SUPABASE_ANON_KEY` = a anon public key copiada no passo 1.

O workflow (`.github/workflows/deploy.yml`) já está configurado para usar
esses dois segredos ao gerar o site — não precisa mexer em mais nada.

### 5. Publicar

Basta dar merge/push nas alterações para a branch `main`. O GitHub Actions
builda o site com as variáveis do passo 4 e publica no GitHub Pages,
exatamente como já acontecia antes.

Para testar **localmente antes de publicar** (opcional, num computador):

```bash
cp .env.example .env
# edite o .env com a Project URL e a anon key
npm install
npm run dev
```

### 6. Testar tudo

1. Abra o site publicado e confirme que a home carrega normalmente.
2. Acesse `/#/admin`, digite seu e-mail (o mesmo do passo 3) e clique em
   "Enviar link de acesso".
3. Abra seu e-mail, clique no link recebido — você deve cair direto no
   painel administrativo logado.
4. Cadastre uma categoria (aba **Categorias**) e um produto (aba
   **Produtos**) de teste.
5. Volte para a home/loja e confirme que o produto aparece.
6. Adicione o produto ao carrinho, finalize o pedido — confirme que ele
   aparece na aba **Pedidos** do painel, e que dá para mudar o status.

## Adicionando produtos reais

Sem seed de demonstração: a loja começa vazia (só as categorias). Cadastre
seus produtos reais pelo painel `/#/admin`, aba **Produtos**. Campos que
merecem atenção:
- **Preço** é o preço cheio; **Preço promocional** só quando o produto está
  em oferta (aparece riscado o preço cheio na loja).
- **Ícone/Cor** definem o visual do produto quando ele não tem foto. Ao
  preencher a **URL da foto**, ela substitui o ícone automaticamente.
- **Produto em destaque** controla a vitrine "Os mais vendidos" da home.

## Checklist final

**Segurança**
- [x] RLS ativo em `categories`, `products`, `orders`, `order_items` e
      `admin_users` (arquivo `02_policies.sql`).
- [x] Visitantes só leem categorias/produtos ativos; só admins escrevem.
- [x] Pedidos: qualquer visitante cria, só admin lê/altera.
- [x] Novos administradores só podem ser adicionados via SQL Editor
      (nenhum caminho de auto-promoção pelo app).
- [x] `service_role key` nunca aparece no código; `.env` está no
      `.gitignore`.

**Performance**
- [x] Índices em `slug`, `category_id`, `is_active`, `is_featured`,
      `order_id`, `status`.
- [x] Consultas da loja pedem só produtos/categorias ativos.
- [x] Imagens de produto usam `loading="lazy"`.

**SEO**
- [x] Título e meta description por rota continuam funcionando
      (`src/App.tsx`), agora usando os nomes reais vindos do banco.
- [x] URLs de categoria/produto mantêm o mesmo formato de antes.

**Manutenção**
- Adicionar um admin: `insert into admin_users (email, role) values (...)`
  no SQL Editor do Supabase.
- Alterar categorias/produtos: pelo painel `/#/admin`, sem precisar mexer
  em código.
- Alterações de schema futuras: crie um novo arquivo `supabase/NN_nome.sql`
  e rode no SQL Editor (não edite os arquivos já aplicados).
