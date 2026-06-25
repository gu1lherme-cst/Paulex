# Paulex Advanced — Documento de Engenharia

> Handbook técnico do tema Shopify da **Paulex Armarinho**. Escrito para quem vai
> manter o tema a longo prazo: arquitetura, fluxo de dados, decisões, riscos,
> segurança, performance, testes e runbook de operação.
>
> Última revisão de engenharia: auditoria completa por time simulado (tech lead,
> backend, frontend, QA, security, performance/a11y) com correções aplicadas.

---

## 1. Visão geral

- **Tipo:** tema Shopify **Online Store 2.0** (templates JSON + sections + blocks).
- **Stack:** Liquid + **Vanilla JS** (custom elements, zero dependências) + CSS
  com custom properties. Sem build step — os arquivos são servidos como estão.
- **Público:** loja de varejo e atacado (papelaria, utilidades, descartáveis,
  brinquedos, informática, cosméticos), tradição "desde 1984".
- **Princípios de design do código:**
  1. **Progressive enhancement** — a loja funciona sem JS (formulários nativos,
     links reais); o JS só melhora a experiência.
  2. **Sem placeholders públicos** — seções sem conteúdo real ficam ocultas na
     loja publicada e só aparecem no editor (`request.design_mode`).
  3. **Honestidade comercial** — nada de frete/contador/depoimento falso; CEP é
     "estimativa informativa"; parcelamento de preço variável é "a partir de".
  4. **i18n** — todo texto vem de `locales/*.json`; o JS recebe strings via
     `window.PaulexSettings`.

---

## 2. Estrutura de arquivos

```
assets/
  theme.js          # toda a lógica do cliente (custom elements + boot)
  theme.css         # design system + componentes (~55 KB)
  animations.js     # parallax do hero (carregado só se "revelar ao rolar" on)
  px-logo.jpeg      # logo fallback (ver §10, item de performance)
  hero-gradient.jpeg
config/
  settings_schema.json  # define a UI do editor de tema
  settings_data.json    # valores atuais + preset "Paulex Advanced"
layout/
  theme.liquid      # <head>, :root CSS vars, PaulexSettings, render de drawers
  password.liquid
locales/
  pt-BR.default.json        # idioma padrão (loja)
  en.json
  pt-BR.default.schema.json # traduções da UI do editor
sections/           # px-hero, px-categories, px-featured-products, px-benefits,
                    # px-promo-banner, px-brands, px-reviews, px-header, px-footer,
                    # main-product, main-collection, main-cart, main-search, ...
snippets/           # price, cart-*, px-product-card, product-media-gallery,
                    # meta-tags, product-schema, breadcrumbs, rating, icon, ...
templates/          # *.json (OS 2.0) + customers/*.liquid + robots/gift_card
tools/
  validate.py       # validador estático (o "test suite" do tema) — ver §11
```

---

## 3. Fluxo de dados

### 3.1 Carrinho (AJAX)
- **Fonte da verdade:** objeto `Cart` em `theme.js` que fala com as rotas Ajax
  da Shopify (`/cart/add.js`, `/cart/change.js`, `/cart/update.js`).
- **Controles de quantidade/remoção:** delegação **global** em
  `initGlobalCartControls()` ligada por `[data-qty-up|down|remove][data-key]` e
  `[data-qty-input][data-key]`. Funciona igual na **página `/cart`** e no
  **drawer** (ambos renderizam itens com `data-key`).
- **Drawer:** o custom element `cart-drawer` cuida só de abrir/fechar, nota e
  cupom (os itens usam a delegação global — ver decisão D2).
- **Re-render:** após cada mutação, `Cart.refresh()` busca `?cart.js`, atualiza o
  contador, re-renderiza o HTML do carrinho e **só então** publica o evento
  (ordem importa: assinantes leem o HTML já atualizado).

### 3.2 Variantes (página de produto)
- `<product-form>` lê `[data-variant-json]` (JSON das variantes renderizado pelo
  Liquid). Ao trocar opção:
  1. `updatePillStates()` marca cada pill como **esgotada** (existe mas sem
     estoque) ou **indisponível** (combinação inexistente).
  2. encontra a variante correspondente; atualiza `id` do form, URL `?variant=`,
     preço/parcelamento, imagem da galeria, SKU e disponibilidade do botão.
  3. dispara `variant:change` → ouvido por `<product-stock>` e
     `<sticky-add-to-cart>`.
- **Guarda de robustez:** se o JSON de variantes não puder ser lido
  (`this.variants.length === 0`), `onVariantChange()` retorna cedo e **mantém o
  estado renderizado no servidor** — evita produto virar não-comprável.

### 3.3 Estoque (`<product-stock>`)
- O Liquid calcula no servidor um booleano `low` por variante e envia só
  `{ available, low }` (NÃO a quantidade exata — ver segurança §9).
- O JS apenas escolhe "Em estoque / Últimas unidades / Sem estoque".

### 3.4 Busca preditiva (`<search-modal>`)
- `fetch` para `/search/suggest.json` (debounce 250 ms).
- Render com `escapeHTML`/`escapeAttr`/`safeUrl` (ver §9).
- Teclado: ↑/↓ navegam, Enter abre, Esc fecha; estados de carregando/sem
  resultado/erro via `aria-live`.

### 3.5 Coleção + filtros (`initCollection`)
- Filtros/ordenação por **AJAX**: monta a URL a partir do form de facetas, busca
  o HTML, troca `.px-collection__results`, o form de facetas e a **contagem**.
- `history.pushState` só em interação do usuário; **`popstate` usa `push=false`**
  para não quebrar o botão Voltar (ver decisão D3).
- Drawer mobile de filtros: overlay + fechar + ESC + foco preso + "Ver
  resultados". Fallback sem JS: a `<form>` faz submit normal.

### 3.6 CEP (`<shipping-calculator>`)
- Valida o endereço via **ViaCEP** (só 8 dígitos numéricos) e mostra cidade/UF +
  prazos **estimados**, deixando claro que valor/prazo finais são no checkout.
  Não é frete real (a Shopify calcula no checkout).

---

## 4. Arquitetura JS (`theme.js`)

IIFE única, `'use strict'`. Utilitários no topo (`$`, `$$`, `formatMoney`,
`debounce`, `escapeHTML`, `escapeAttr`, `safeUrl`, `trapFocus`, `Toast`, `Cart`).

Custom elements registrados:

| Tag | Responsabilidade |
|-----|------------------|
| `sticky-header` | sombra/encolher no scroll |
| `cart-drawer` | abrir/fechar, nota, cupom |
| `search-modal` | busca preditiva + teclado |
| `product-form` | add-to-cart AJAX + troca de variante |
| `product-stock` | estado de estoque por variante |
| `sticky-add-to-cart` | barra fixa de compra |
| `product-gallery` | galeria + zoom (lightbox) |
| `shipping-calculator` | estimativa por CEP |

`bindDrawer()` padroniza drawers (abrir/fechar, foco preso via `trapFocus`,
retorno de foco, ESC). `init()` no boot liga delegação de carrinho, mobile nav,
coleção, related e reveals.

---

## 5. Sistema de design (CSS)

- Tokens em `:root` (gerados pelo Liquid em `layout/theme.liquid` a partir das
  configurações): `--color-primary/accent/sale/success/text/bg/surface`,
  `--gradient-hero`, fontes, `--radius`, `--page-width`, `--section-spacing`.
- **rgb companions** (`--color-*-rgb`) para usar `rgba(var(--x-rgb), .08)`.
- **Fallbacks à prova de falhas** (ver decisão D1): cores e gradiente têm default
  no Liquid **e** fallback no CSS, então a loja nunca renderiza "branco no
  branco" mesmo se a Shopify não importar alguma configuração.

---

## 6. Internacionalização

- `locales/pt-BR.default.json` é o idioma padrão; `en.json` o secundário.
- **Pluralização** usa o formato Shopify `{ "one": "...", "other": "..." }`
  (não sufixo `_one`). Ex.: `collections.general.products_count`.
- Strings de runtime do JS são injetadas em `window.PaulexSettings.strings`
  (em `layout/theme.liquid`) e lidas como `Strings.*` no `theme.js`. O validador
  garante que todo `Strings.*` usado está definido (§11).

---

## 7. Decisões técnicas (ADR resumido)

- **D1 — Fallback de cores em duas camadas.** Sintoma real: ao subir o tema por
  ZIP, a Shopify às vezes não importa configurações `color_background`
  (gradiente), deixando `--gradient-hero` vazio → hero branco. Decisão: default
  no Liquid (`settings.x | default: ...`) **e** fallback no CSS
  (`background: var(--color-primary); background: var(--gradient-hero, ...)`).
  Custo: duas linhas a mais; benefício: impossível ficar branco.
- **D2 — Uma única fonte para controles de quantidade.** Havia código duplicado
  no `cart-drawer` (`bindItemControls/adjust/setQty`) nunca chamado. Decisão:
  remover o código morto e padronizar na delegação global por `[data-key]`.
  Consequência de segunda ordem evitada: dupla-ligação (quantidade pulando de
  +1 para +2) caso o código morto fosse reativado.
- **D3 — `popstate` não re-empilha histórico.** `applyUrl(url, push)`: `push`
  default `true` em interações; `false` no `popstate`. Evita prender o usuário no
  botão Voltar.
- **D4 — Não animar o hero com `data-reveal`.** O hero é o LCP; começar com
  `opacity:0` atrasa a métrica e arrisca tela vazia sem JS. CSS força o hero
  sempre visível e há fallback `.no-js [data-reveal] { opacity: 1 }`.
- **D5 — Estoque exato não vai ao cliente.** Só o booleano `low` (§9).

---

## 8. Registro de riscos / pontos frágeis

| Risco | Mitigação atual | Observação |
|-------|-----------------|------------|
| Config não importada no upload por ZIP | Fallback D1 | Resolvido |
| JSON de variantes malformado | Guarda em `onVariantChange` | Resolvido |
| `bindDrawer` adiciona 1 listener `keydown` global por instância | Poucas instâncias; cada um checa o próprio `is-open` | **Conhecido/baixo** — refatorar para um gerenciador ESC único se crescer |
| `theme.css` render-blocking (~55 KB) | `{% style %}` crítico inline; `preconnect` ao CDN | **Conhecido** — minificar reduz ~30–40% |
| `px-logo.jpeg` ~100 KB para logo pequeno | usado só como fallback; logo oficial via `section.settings.logo` usa `image_url`/`widths` | **Conhecido** — otimizar o asset ou subir logo pelo editor |
| Predictive search expõe `price` mínimo | aceitável; consistente com "a partir de" | Baixo |

---

## 9. Revisão de segurança (achados e correções)

Auditoria adversarial dedicada. Resultado após correções:

| Sev | Item | Status |
|-----|------|--------|
| **CRÍTICO** | XSS refletido via `search.terms` em `main-search.liquid` (interpolação em `| t:` sem escape) | **Corrigido** — `search.terms | escape` antes do `| t` |
| MÉDIO | `inventory_quantity` real exposto no `data-stock-json` | **Corrigido** — servidor envia só `low` (booleano) |
| MÉDIO | `escapeAttr` não bloqueava `javascript:` em hrefs da busca | **Corrigido** — `safeUrl()` aceita só relativo/http(s) |
| BAIXO | `og:image` servido por `http:` | **Corrigido** — `https:` |

**Verificado seguro:** `window.PaulexSettings` (só rotas públicas + strings),
JSON-LD (tudo via `| json`), re-render same-origin (cart/coleção/related),
`target="_blank"` com `rel="noopener"`, ViaCEP (só 8 dígitos), escape de texto
na busca preditiva (`escapeHTML`), `| escape` nos atributos Liquid.

**Princípio:** todo dado que vira HTML no cliente passa por `escapeHTML`
(texto), `escapeAttr` (atributo) ou `safeUrl` (href). Todo dado de URL/usuário no
Liquid passa por `| escape`. Dados de negócio sensíveis (estoque) são reduzidos
no servidor.

---

## 10. Performance

- **Imagens:** `image_tag` com `widths`/`sizes`/`loading`. Hero e imagem de
  artigo: `loading: eager` + `fetchpriority: high` (LCP). Demais: `lazy`.
  Hero e logo declaram `width`/`height` (evita CLS).
- **JS:** `defer`; custom elements só inicializam o que existe na página;
  `IntersectionObserver` para reveals e sticky bar.
- **CSS:** bloco crítico inline (`:root`, fontes); `preconnect` ao CDN.
- **Pendências conhecidas:** minificar `theme.css`; otimizar `px-logo.jpeg`
  (§8).

---

## 11. Testes — `tools/validate.py`

Como Liquid não roda fora da Shopify, o validador estático é o test suite. Roda
**270+ verificações**:

1. todo `.json` faz parse; 2. todo `{% schema %}` é JSON válido;
3. tags Liquid balanceadas; 4. chaves CSS balanceadas;
5. toda chave `| t` existe no locale (com suporte a pluralização one/other);
6. todo `Strings.*` do JS está em `PaulexSettings`;
7. custom elements usados estão registrados;
8. sem `Produto exemplo`/`R$ 0,00` fora de `request.design_mode`;
9. sem `href="#"`/`default:'#'` (ignora comentários);
10. `node --check` em `theme.js`/`animations.js`.

```bash
python3 tools/validate.py     # 0 = ok, 1 = falhou
```

> O validador ignora blocos `{% comment %}` para não dar falso positivo em
> documentação. Rode-o antes de cada commit e no CI.

### Checklist de testes manuais (na loja de desenvolvimento)
- **Home:** com e sem produtos/coleções; CTAs; categorias no mobile.
- **Produto:** sem variante, com variantes, esgotado, em promoção, sem imagem;
  add-to-cart; quantidade; sticky bar; CEP válido/ inválido; WhatsApp com/sem
  número.
- **Carrinho:** drawer e `/cart` — +/−/remover, cupom, nota, checkout.
- **Busca:** termo existente/inexistente; teclado (↑/↓/Enter/Esc).
- **Coleção:** ordenar, filtrar, limpar, drawer mobile + ESC, botão Voltar.
- **Conta:** login, cadastro, criar/editar/remover endereço.

---

## 12. Runbook (operação)

### Publicar / atualizar o tema
```bash
cd paulex-shopify-theme
zip -r ../paulex-advanced.zip assets config layout locales sections snippets templates
# Shopify → Loja virtual → Temas → Adicionar tema → Upload do ZIP → Visualizar → Publicar
```
Ou com a CLI: `shopify theme dev` (preview) / `shopify theme push` /
`shopify theme check`.

### Configuração inicial obrigatória
1. **WhatsApp** (Config. do tema → Redes sociais) — formato `5521987578187`.
   Sem número, botões de WhatsApp somem (nunca link quebrado).
2. **Produtos + coleções** e apontar as seções "Categorias" e "Produtos em
   destaque". Sem coleção, essas seções ficam ocultas na loja publicada.
3. **Frete grátis** (Config. do tema → Carrinho) — padrão R$ 199; `0` esconde a
   barra.

### Troubleshooting
- **Hero/área branca após upload:** já mitigado (D1). Se persistir, confira em
  Config. do tema → Cores se primária e gradiente estão preenchidos; o CSS cai
  para o azul da marca automaticamente.
- **Seções de produto vazias:** esperado sem produtos/coleções — cadastre e
  aponte as coleções (§12.2). Não é bug.
- **"1 produtos":** corrigido (pluralização one/other).

---

## 13. Roadmap

- Minificar `theme.css` e otimizar `px-logo.jpeg`.
- Gerenciador único de ESC para drawers (remover listeners por instância).
- Galeria de produto com vídeo + recomendações por IA da Shopify.
- App de avaliações populando os metafields `reviews.rating` já suportados.
- Páginas institucionais (Sobre, Atacado, Política de trocas) e blog.
- CI rodando `tools/validate.py` + `shopify theme check` a cada push.
