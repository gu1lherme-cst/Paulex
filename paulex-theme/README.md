# Paulex Advanced — Tema Shopify (Online Store 2.0)

Tema premium, minimalista e de alta performance para a **Paulex Armarinho**,
inspirado no nível de qualidade de marcas como Apple, Tesla, Amazon e Nike.
Construído 100% em Liquid + JSON templates + JS modular (sem dependências),
compatível com **Shopify Online Store 2.0** e totalmente editável pelo Theme Editor.

> **Onde fica:** este tema vive na pasta `paulex-theme/` deste repositório.
> A landing page React na raiz do repositório é um projeto separado e não é afetada.

---

## ✨ Destaques

- **Cabeçalho branco fixo** que reduz de altura e ganha sombra/blur ao rolar.
- **Hero** full-width com gradiente `#003DFF → #14D8FF`, chips de confiança e
  composição premium de produtos (com parallax sutil).
- **Carrinho em drawer** lateral com atualização AJAX, barra de frete grátis,
  campo de cupom e observações.
- **Busca instantânea** (predictive search) com produtos, categorias e páginas.
- **Página de produto** completa: galeria com zoom e vídeo, troca de variantes
  sem reload, comprar agora, calcular frete por CEP (ViaCEP), produtos
  relacionados e "compre junto".
- **Coleção** com filtros (facets) e ordenação via AJAX, sem recarregar a página.
- **SEO**: Schema.org (Organization, WebSite + SearchAction, Product, BreadcrumbList),
  Open Graph, Twitter Cards, canonical, breadcrumbs e robots.txt customizável.
- **Performance**: CSS otimizado, JS `defer` modular, lazy-loading, imagens
  responsivas (`image_tag` com `srcset`/`sizes`), fontes com `font-display: swap`.
- **Acessibilidade**: foco visível, focus-trap em modais, `aria-*`, skip-link,
  respeito a `prefers-reduced-motion`.

---

## 🎨 Identidade

| Token            | Cor       |
|------------------|-----------|
| Azul principal   | `#003DFF` |
| Azul claro       | `#14D8FF` |
| Vermelho (oferta)| `#FF1D25` |
| Branco           | `#FFFFFF` |
| Texto            | `#111111` |
| Cinza superfície | `#F7F7F7` |

Todas as cores, tipografia, raio de cantos, largura e espaçamentos são
configuráveis em **Tema → Personalizar → Configurações do tema**.

---

## 📁 Estrutura

```
paulex-theme/
├── assets/        theme.css, theme.js, animations.js, logo
├── config/        settings_schema.json, settings_data.json
├── layout/        theme.liquid, password.liquid
├── locales/       pt-BR (default) + en + schema labels
├── sections/      header/footer groups, px-* (home) e main-* (páginas)
├── snippets/      icon, meta-tags, price, rating, product-card, cart-*, etc.
└── templates/     index, product, collection, cart, search, page, blog,
                   article, 404, list-collections, gift_card, password,
                   robots.txt, customers/*
```

### Seções da home (`templates/index.json`)
`px-hero` · `px-categories` · `px-benefits` · `px-featured-products` (Mais
vendidos, Novidades…) · `px-promo-banner` · `px-brands` · `px-reviews`
· newsletter no rodapé.

Cada seção tem `presets` e blocos, então pode ser adicionada/reordenada
livremente no Theme Editor.

---

## 🚀 Instalação

### Opção A — Shopify CLI (recomendado)
```bash
cd paulex-theme
shopify theme dev    # preview local com hot reload
shopify theme push   # envia para a loja
```

### Opção B — Upload manual
1. Compacte **o conteúdo** da pasta `paulex-theme/` em um `.zip`
   (os diretórios `assets`, `config`, `layout`, … devem ficar na raiz do zip).
2. Em **Loja online → Temas → Adicionar tema → Fazer upload do arquivo zip**.

### Configuração pós-instalação
1. Crie os menus **`main-menu`** (Início, Papelaria, Utilidades, Descartáveis,
   Brinquedos, Informática, TV e acessórios) e **`footer`**.
2. Crie as coleções com os handles: `papelaria`, `utilidades`, `descartaveis`,
   `brinquedos`, `informatica`, `tv-e-acessorios`.
3. Em **Configurações do tema → Redes sociais**, informe o número do WhatsApp
   (formato internacional, ex.: `5511999999999`).
4. Vincule cada bloco de **Categorias** e de **Produtos em destaque** às coleções.

---

## 🔌 Integrações opcionais

- **Avaliações**: o tema lê os metafields `reviews.rating` e
  `reviews.rating_count` (padrão do app **Shopify Product Reviews** / Judge.me),
  exibindo estrelas nos cards, na página de produto e no JSON-LD.
- **Recomendações**: "Você também pode gostar" usa a API nativa de
  recomendações; "Compre junto" usa o metafield de produtos complementares do
  app **Search & Discovery**.

---

## 🧱 Padrões de código

- Componentes reutilizáveis via `snippets` e Web Components (`custom elements`).
- Sem duplicação: card de produto, preço, ícones e carrinho são snippets únicos.
- JS isolado em IIFE, com API pública mínima em `window.Paulex`.
- Comentado e organizado por blocos.

Desenvolvido para a Paulex — desde 1984. 🛒
