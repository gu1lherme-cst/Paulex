# Paulex Armarinho — App (React + Vite)

Loja online completa + **Paulex Club** (fidelidade) + **Painel Administrativo**,
em React + TypeScript. PWA (instala como aplicativo e funciona offline).

> A versão antiga (HTML/CSS/JS puro) foi preservada na pasta `legacy/`.

## Como rodar e ver no seu computador

Você precisa do [Node.js](https://nodejs.org) 18+ instalado. No terminal,
dentro da pasta do projeto:

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # inicia o servidor de desenvolvimento
```

Abra o endereço que aparecer (normalmente <http://localhost:5173>).
Para testar no celular, use o link "Network" que o comando mostra (mesma rede Wi‑Fi).

Para gerar a versão final (otimizada) e pré-visualizá-la:

```bash
npm run build    # gera a pasta dist/
npm run preview  # serve a versão final localmente
```

## Como publicar (ficar no ar de graça)

O repositório já vem com um workflow do **GitHub Pages**
(`.github/workflows/deploy.yml`). Para ativar:

1. No GitHub, vá em **Settings → Pages** e em *Source* escolha **GitHub Actions**.
2. Faça merge na branch `main`. O site é publicado automaticamente em
   `https://gu1lherme-cst.github.io/Paulex/`.

## Painel Administrativo

Acesse `/#/admin` (ou Conta → Painel Administrativo). É liberado apenas para os
e‑mails listados em `src/context/AuthContext.tsx` (`ADMIN_EMAILS`). Faça login
com um desses e‑mails para entrar. O painel tem:

- **Dashboard**: faturamento, nº de pedidos, ticket médio, itens vendidos,
  gráfico de vendas e produtos mais vendidos.
- **Produtos**: criar, editar, remover, controlar preço/estoque e destaques.
- **Pedidos**: acompanhar e mudar o status de cada pedido.

## Pagamento online (Pix / cartão)

Por padrão o checkout finaliza pelo **WhatsApp** (sem custo nem cadastro).
Para habilitar Pix e cartão de verdade, siga `server/README.md` e preencha
`VITE_PAYMENTS_API` no `.env`. O fluxo usa Mercado Pago Checkout Pro, com a
chave secreta protegida num backend.

## Backend na nuvem (opcional)

Hoje os dados (carrinho, pedidos, conta) ficam salvos **no navegador**. Para
compartilhar entre dispositivos, plugue um backend (Supabase recomendado) em
`src/lib/cloud.ts`. Enquanto não configurado, o app funciona 100% offline.

## Estrutura

```
src/
  data/catalog.ts      Produtos, categorias, cupons e configurações da loja
  context/             Estado global (loja, autenticação, avisos)
  lib/                 Preços, formatação, dados, pagamento, club, whatsapp
  components/          Componentes reutilizáveis (cards, busca, layout)
  pages/               Telas da loja (home, produto, carrinho, checkout...)
  admin/               Painel administrativo (dashboard, produtos, pedidos)
server/                Exemplo de backend de pagamento (Mercado Pago)
legacy/                Versão anterior do site (referência)
```

## Variáveis de ambiente

Copie `.env.example` para `.env`. Tudo é opcional — veja os comentários.
