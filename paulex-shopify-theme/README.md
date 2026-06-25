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

## Próximas evoluções sugeridas (roadmap)

Itens das fases 2–8 do briefing ainda não implementados, em ordem de impacto:

- **Produto premium**: blocos configuráveis (trust badges, status de estoque,
  SKU/código de barras, mensagem de entrega, CTA de WhatsApp do produto,
  sticky add-to-cart), pills de variante com estados indisponível/esgotado.
- **CEP honesto**: deixar claro que é estimativa e que valor/prazo finais são
  no checkout; mostrar retirada na loja quando aplicável.
- **Busca**: `escapeHTML` nos resultados e navegação por teclado (↑/↓/Enter/Esc).
- **Coleção**: breadcrumb, toolbar com contagem/ordenação, filtros mobile em
  drawer com ESC e empty state comercial.
- **SEO**: revisar JSON-LD de Organization (logo + `sameAs`) e breadcrumb.
- **Performance/A11y**: `image_tag` com `widths/sizes/loading` em todas as
  imagens, foco preso em modais/drawers e retorno de foco ao fechar.
