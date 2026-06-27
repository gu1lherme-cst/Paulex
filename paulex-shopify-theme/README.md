# Paulex Advanced — Tema Shopify

Tema **Online Store 2.0** da **Paulex Armarinho** (tradição desde 1984). Loja
tradicional de papelaria, utilidades, descartáveis, brinquedos, informática,
cosméticos e itens para casa/escritório — atacado e varejo.

Identidade: azul, vermelho e branco. JavaScript puro (Vanilla JS), sem
dependências externas. Mobile first, acessível e otimizado para conversão.

---

## Como subir na Shopify

O tema fica versionado nesta pasta. Para publicar na sua loja, há dois caminhos:

### Opção A — Upload pelo painel (mais simples)

1. Compacte **o conteúdo desta pasta** em um `.zip` (a raiz do zip deve conter
   `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`,
   `templates/` — **não** a pasta `paulex-shopify-theme/` por fora).
   ```bash
   cd paulex-shopify-theme
   zip -r ../paulex-advanced.zip assets config layout locales sections snippets templates
   ```
2. No admin da Shopify: **Loja virtual → Temas → Adicionar tema → Fazer upload do arquivo zip**.
3. Selecione `paulex-advanced.zip` e clique em **Carregar**.
4. **Visualizar** para testar; **Publicar** quando estiver pronto.

### Opção B — Shopify CLI (recomendado para desenvolvimento)

```bash
cd paulex-shopify-theme
shopify theme dev        # preview local com hot reload
shopify theme push       # envia para a loja
shopify theme check      # validação oficial do tema
```

---

## Configuração inicial obrigatória

Depois de subir, abra o **editor de tema** e configure:

1. **WhatsApp** — Configurações do tema → Redes sociais → WhatsApp.
   Use o formato internacional, ex.: `5521987578187`. Sem número, o botão
   flutuante e os CTAs de WhatsApp simplesmente não aparecem (nunca um link quebrado).
2. **Coleções** — crie as coleções (Papelaria, Utilidades, Descartáveis,
   Brinquedos, Informática, TV e acessórios, Cosméticos, Ofertas) e aponte:
   - a seção **Categorias** (cada card → uma coleção);
   - a(s) seção(ões) **Produtos em destaque** → uma coleção.
   > Sem coleção configurada, essas seções ficam **ocultas na loja publicada**
   > (aparecem só no editor com um aviso). Nada de "Produto exemplo" ou "R$ 0,00".
3. **Frete grátis** — Configurações do tema → Carrinho → "Valor mínimo para
   frete grátis" (padrão R$ 199). Coloque `0` para esconder a barra de progresso.
4. **Menu** — Loja virtual → Navegação. Sem menu, há um fallback automático
   no header (desktop e mobile) com as categorias principais.

---

## B2B / Atacado

O tema tem uma camada de atacado pronta. Para ativar:

1. **Crie uma coleção de atacado** (ex.: "Atacado") com os produtos.
2. **Crie uma página "Atacado"** (Loja virtual → Páginas → Adicionar) e, no
   editor de tema, atribua o template **`page.atacado`**. Ele já traz a seção
   institucional **Atacado / Empresas** + o **Pedido rápido**.
   - Na seção "Pedido rápido", aponte a **coleção de atacado**.
3. **Preço de atacado por produto (opcional)** — defina os metafields do produto:
   - `custom.atacado_min` (número) → quantidade mínima de atacado (ex.: 12);
   - `custom.atacado_preco` (dinheiro/texto) → preço por unidade no atacado.
   Com isso, a página do produto mostra o bloco **Preço de atacado** e os cards
   ganham o selo **Atacado**.
4. **Pedido mínimo / múltiplos (opcional)** — metafields do produto:
   - `custom.min_quantity` (número) → quantidade mínima de compra;
   - `custom.qty_increment` (número) → passo do contador (ex.: 12 em 12).

O **Pedido rápido** adiciona vários itens ao carrinho de uma vez e, se houver
WhatsApp configurado, gera um **orçamento** com os itens. O total exibido é uma
estimativa pelo preço de tabela; descontos e valor final são no checkout.

---

## Estrutura

```
assets/      theme.css, theme.js, animations.js, imagens base
config/      settings_schema.json (opções do editor), settings_data.json
layout/      theme.liquid, password.liquid
locales/     pt-BR.default.json, en.json, schema de tradução
sections/    header, hero, categorias, benefícios, produtos, banner, reviews, footer…
snippets/    price, cart-*, product-card, gallery, meta-tags, schema, rating…
templates/   index/product/collection/cart/search/blog… (JSON OS 2.0) + customers
```

---

## Correções e melhorias aplicadas

### Fase 1 — Correções críticas (estabilidade)
- **Skip link** usa a chave correta `general.accessibility.skip_to_text`.
- **Preço variável** ("A partir de R$ X") formata o dinheiro antes da tradução.
- **Parcelamento** correto: "ou 12x de R$ X sem juros" (pt-BR e en).
- **Barra de frete grátis** configurável (`cart_free_shipping_threshold`),
  formatação correta e proteção contra divisão por zero (esconde se = 0).
- **Carrinho AJAX** com delegação global de eventos: aumentar/diminuir/remover
  funcionam tanto no drawer quanto na página `/cart`; contador e subtotal
  atualizam; cupom e nota do pedido funcionam fora do drawer.
- **WhatsApp** sem placeholder fictício; número sanitizado em todo `wa.me`;
  botão some quando não há número configurado.
- **Menu mobile** com fallback de categorias quando não há menu configurado.
- **Endereços do cliente** com IDs únicos por formulário (`id_suffix`),
  corrigindo seletor de país/estado duplicado.
- **Produtos complementares** dependem só do metafield válido.
- **Imagem da variante** troca na galeria ao selecionar a variante.

### Auditoria adicional (esta entrega)
- **Sem placeholders públicos**: "Produto exemplo / R$ 0,00" aparece apenas no
  editor (`request.design_mode`); na loja publicada a seção fica oculta.
- **Sem links quebrados (`href="#"`)**: categorias, banner promocional e botão
  secundário do hero só viram link quando têm destino real; caso contrário
  ficam ocultos na loja (e visíveis no editor para configurar).
- Validação: todos os JSON e blocos `{% schema %}` com parse OK; tags Liquid
  balanceadas nos arquivos alterados.

---

### Fase 2 — Produto premium e conversão (implementado)
- **Novos blocos configuráveis** na página de produto (liga/desliga no editor):
  - **Status de estoque** — "Em estoque / Últimas unidades / Sem estoque", com
    limite de baixo estoque configurável; atualiza ao trocar de variante.
  - **SKU / código de barras** — atualiza o SKU dinamicamente por variante.
  - **Selos de confiança** — compra segura, retirada na loja, atendimento
    WhatsApp, troca facilitada, parcelamento (cada um com texto editável).
  - **Mensagem de entrega** — texto livre com ícone.
  - **Botão "Tirar dúvida no WhatsApp"** — abre conversa já com nome e link do
    produto; some quando não há WhatsApp configurado.
  - **Barra fixa de compra (sticky add-to-cart)** — aparece ao rolar para além
    do botão principal; mostra miniatura, título, preço e botão; respeita a
    variante selecionada; mobile e desktop.
- **Variantes premium**: pills com estado selecionado, **esgotado** (riscado) e
  **indisponível** (combinação inexistente); botão desabilitado e texto
  "Indisponível"/"Esgotado"; atualiza preço, parcelamento, SKU, imagem da
  galeria e a URL (`?variant=`) sem recarregar.
- **CEP honesto**: mostra cidade/UF, deixa claro que é **estimativa
  informativa**, exibe retirada na loja (opcional) e avisa que **valor e prazo
  finais são calculados no checkout**. Textos traduzíveis (pt-BR e en).

### Fase 4 — Coleção, filtros e cards (implementado)
- **Cards de produto**: CTA "Ver opções" para produtos com variantes (quick add
  só para variante única disponível); altura de título consistente (2 linhas)
  para alinhar o grid; sem hover da 2ª imagem nem zoom em telas touch.
- **Drawer de filtros mobile**: painel deslizante com overlay, botão fechar,
  fecha com **ESC** e clique no overlay, foco preso no drawer e botão
  **"Ver resultados"**; filtros e ordenação por AJAX com fallback sem JS.
- **Contagem de produtos** atualiza junto com os resultados no AJAX; estado de
  carregando nos resultados.
- **Empty state comercial**: distingue "nenhum produto com esses filtros"
  (com botão **Limpar filtros**) de uma coleção realmente vazia.

### Fase 5 — Busca segura e navegável (implementado)
- **Sanitização**: títulos, URLs e textos dos resultados passam por
  `escapeHTML`/`escapeAttr` antes de virar HTML (defesa contra injeção).
- **Teclado**: ↑/↓ navegam entre resultados, **Enter** abre o selecionado,
  **Esc** fecha; `role="combobox"`/`aria-expanded`/`role="option"`.
- **Estados**: "Buscando…", "Nenhum resultado", erro de rede — todos via
  `aria-live` no container de resultados. Botão "Ver todos os resultados".

### Fase 6 — SEO e dados estruturados (implementado)
- **Organization JSON-LD** usa o logo real da marca (`shop.brand.logo`, com
  fallback para a imagem de compartilhamento), inclui `description` da marca e
  `sameAs` só com redes preenchidas (Instagram, Facebook, YouTube, TikTok).
- **WebSite + SearchAction** na home; **BreadcrumbList** (microdados) em
  produto, coleção e artigo; **Product JSON-LD** com `itemCondition`, ofertas
  por variante e moeda correta; `og:locale` no formato `pt_BR`.

### Fase 7-8 — Acessibilidade e performance (implementado)
- Modais/drawers (carrinho, busca, menu, filtros) fecham com **Esc**, prendem
  o foco e o devolvem ao botão que abriu.
- `type="button"` explícito em todos os botões que não enviam formulário.
- Imagens com `widths/sizes/loading`; hero e imagem de artigo com
  `loading: eager` + `fetchpriority: high`; demais com `lazy`. Scripts com
  `defer`. `prefers-reduced-motion` respeitado.

## Próximas evoluções sugeridas (roadmap)

A base do briefing (fases 1–8) está implementada. Possíveis próximos passos:

- Testar o tema numa loja de desenvolvimento (Shopify CLI / `theme check`).
- Página de produto: galeria com zoom/vídeo e recomendações por IA da Shopify.
- Blog e páginas institucionais (Sobre, Atacado, Política de trocas).
- Integração de avaliações (app de reviews) populando os metafields já usados.
- **Coleção**: breadcrumb, toolbar com contagem/ordenação, filtros mobile em
  drawer com ESC e empty state comercial.
- **SEO**: revisar JSON-LD de Organization (logo + `sameAs`) e breadcrumb.
- **Performance/A11y**: `image_tag` com `widths/sizes/loading` em todas as
  imagens, foco preso em modais/drawers e retorno de foco ao fechar.
