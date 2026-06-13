/* ============================================================
   CATÁLOGO PAULEX — produtos.js
   ============================================================
   Este arquivo contém TODOS os produtos e categorias do site.
   Você pode editar preços, estoque e textos aqui, sem mexer
   no restante do código.

   COMO EDITAR UM PRODUTO
   - preco:        preço unitário (use ponto: 12.90)
   - precoAntigo:  preço riscado; junto com promo: true vira OFERTA
   - estoque:      unidades disponíveis
   - desc:         descrição mostrada na página do produto
   - specs:        pares ["Nome", "Valor"] das especificações
   - imagem:       (opcional) caminho da FOTO REAL do produto, ex.:
                   imagem: "img/produtos/caneta-bic.jpg"
                   Com foto definida, ela substitui a ilustração em todo
                   o site automaticamente.

   DESTAQUES (opcionais)
   - maisVendido: true  -> aparece em "Mais vendidos"
   - promo: true        -> aparece em "Promoções/Ofertas" (selo OFERTA)
   - novidade: true     -> aparece em "Novidades" (selo NOVO)

   DESCONTO POR QUANTIDADE (opcional)
   - tiers: faixas com { de, ate, preco, off }
     (use ate: Infinity na última faixa)

   Para ADICIONAR um produto, copie um bloco { ... } existente,
   cole antes do "];" final e ajuste os campos. O campo id deve
   ser único, sem espaços (ex.: "caderno-capa-dura").
   ============================================================ */

const WHATSAPP_NUMBER = "5521987578187"; // WhatsApp da loja (55 + DDD + número)
const FRETE_GRATIS_MIN = 99; // valor mínimo para frete grátis

/* ATACADO PARA EMPRESAS
   A partir de ATACADO_MIN peças do MESMO produto, o cliente paga o
   preço de atacado automaticamente. Por padrão, o atacado é
   ATACADO_DESCONTO_PADRAO % abaixo do preço normal.
   Para definir um preço de atacado exato em um produto, adicione o
   campo  precoAtacado: 0.89  no bloco dele (vale mais que o padrão).
   Produtos com a tabela "tiers" usam as faixas próprias. */
const ATACADO_MIN = 12;            // peças a partir das quais vale o atacado
const ATACADO_DESCONTO_PADRAO = 15; // % de desconto padrão no atacado

/* LOGIN COM GOOGLE (opcional)
   O botão "Entrar com Google" só aparece depois que você criar uma
   credencial gratuita e colar o ID abaixo. Passo a passo:
   1. Acesse https://console.cloud.google.com/apis/credentials
      (entre com a conta Google da loja e crie um projeto, se pedir)
   2. Clique em "Criar credenciais" > "ID do cliente OAuth"
   3. Tipo de aplicativo: "Aplicativo da Web"
   4. Em "Origens JavaScript autorizadas", adicione:
      https://gu1lherme-cst.github.io
   5. Copie o "ID do cliente" gerado (termina com
      .apps.googleusercontent.com) e cole entre as aspas abaixo. */
const GOOGLE_CLIENT_ID = "";

/* CUPONS DE DESCONTO
   O cliente digita o código no carrinho. Para criar um cupom novo,
   copie uma linha e ajuste: o número é a porcentagem de desconto.
   Para desativar um cupom, apague a linha (ou coloque // na frente). */
const CUPONS = {
  PAULEX10: { desconto: 10, descricao: "10% de desconto" },
  CLUB5:    { desconto: 5,  descricao: "5% de desconto" },
};

/* Ilustrações de produto — duotone azul Paulex */
const art = (inner) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="#0B3BA7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" role="img">${inner}</svg>`;

const icon = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const CATEGORIES = [
  {
    id: "papelaria", nome: "Papelaria",
    desc: "Cadernos, canetas, lápis e muito mais",
    icon: icon('<path d="M4 20l1.5-5L16 4.5l3.5 3.5L9 18.5 4 20z"/><path d="M13.5 7l3.5 3.5"/>'),
  },
  {
    id: "utilidades", nome: "Utilidades",
    desc: "Produtos para o dia a dia e organização",
    icon: icon('<path d="M4 8l8-4 8 4v9l-8 4-8-4V8z"/><path d="M4 8l8 4 8-4M12 12v9"/>'),
  },
  {
    id: "descartaveis", nome: "Descartáveis",
    desc: "Copos, pratos, talheres e embalagens",
    icon: icon('<path d="M7 4h10l-1.5 16h-7L7 4z"/><path d="M7.8 9h8.4"/>'),
  },
  {
    id: "brinquedos", nome: "Brinquedos",
    desc: "Diversão para todas as idades",
    icon: icon('<rect x="4" y="12.5" width="7" height="7" rx="1"/><rect x="13" y="12.5" width="7" height="7" rx="1"/><rect x="8.5" y="4" width="7" height="7" rx="1"/>'),
  },
  {
    id: "informatica", nome: "TV e Acessórios",
    desc: "Acessórios, periféricos e muito mais",
    icon: icon('<rect x="5" y="5" width="14" height="9" rx="1.5"/><path d="M3 18h18l-2-4H5l-2 4z"/>'),
  },
  {
    id: "cosmeticos", nome: "Cosméticos",
    desc: "Beleza e cuidados pessoais",
    icon: icon('<path d="M10 3h4v3h-4z"/><rect x="7.5" y="6" width="9" height="14" rx="3"/><path d="M10 11h4"/>'),
  },
];

const PRODUCTS = [
  /* ---------- Papelaria ---------- */
  {
    id: "caneta-bic", nome: "Caneta BIC Cristal Azul", unidade: "Unidade",
    preco: 1.20, cat: "papelaria",
    desc: "A clássica esferográfica de escrita macia e tinta de longa duração. Corpo transparente que permite ver o nível da tinta. Ideal para escritório, escola e revenda.",
    specs: [["Cor da tinta", "Azul"], ["Ponta", "Média 1.0 mm"], ["Marca", "BIC"], ["Rendimento", "Até 2 km de escrita"]],
    art: art('<path d="M44 10 54 20 26 48 16 38z" fill="#DEE8FB"/><path d="M16 38 10 54 26 48z" fill="#fff"/><path d="m10 54 5-5"/><path d="M40 14l10 10"/>'),
    rating: 4.5, avaliacoes: 1256, estoque: 350,
    maisVendido: true,
    tiers: [
      { de: 1,   ate: 11,       preco: 1.20, off: null },
      { de: 12,  ate: 49,       preco: 1.05, off: "-12%" },
      { de: 50,  ate: 99,       preco: 0.99, off: "-18%" },
      { de: 100, ate: Infinity, preco: 0.89, off: "-25%" },
    ],
  },
  {
    id: "caderno-tilibra", nome: "Caderno Universitário Tilibra 10 Matérias", unidade: "Unidade",
    preco: 34.90, cat: "papelaria",
    desc: "Caderno universitário espiral com capa dura, 10 matérias e 160 folhas pautadas. Divisórias coloridas e folhas que não borram.",
    specs: [["Folhas", "160"], ["Matérias", "10"], ["Capa", "Dura"], ["Marca", "Tilibra"]],
    art: art('<rect x="18" y="10" width="32" height="44" rx="5" fill="#DEE8FB"/><path d="M27 10v44"/><path d="M34 24h9M34 32h9M34 40h6"/><path d="M18 18h-5M18 26h-5M18 34h-5M18 42h-5"/>'),
    rating: 4.8, avaliacoes: 842, estoque: 120, maisVendido: true,
  },
  {
    id: "papel-chamex", nome: "Papel Sulfite A4 Chamex 500 folhas", unidade: "Pacote",
    preco: 27.90, cat: "papelaria",
    desc: "Papel sulfite branco A4 75g/m², pacote com 500 folhas. Alta alvura e gramatura uniforme — perfeito para impressões, cópias e uso diário no escritório.",
    specs: [["Formato", "A4 (210 × 297 mm)"], ["Gramatura", "75 g/m²"], ["Folhas", "500"], ["Marca", "Chamex"]],
    art: art('<path d="M24 12h24v36"/><rect x="16" y="16" width="24" height="36" rx="2" fill="#fff"/><path d="M22 28h12M22 34h12M22 40h8"/>'),
    rating: 4.7, avaliacoes: 2310, estoque: 200, maisVendido: true,
  },
  {
    id: "lapis-faber", nome: "Lápis HB Faber-Castell", unidade: "Unidade",
    preco: 1.00, precoAntigo: 1.50, cat: "papelaria",
    desc: "Lápis grafite HB nº 2 com madeira 100% reflorestada. Apontamento fácil e traço uniforme, o queridinho das listas de material escolar.",
    specs: [["Dureza", "HB nº 2"], ["Madeira", "Reflorestada"], ["Marca", "Faber-Castell"]],
    art: art('<path d="M42 12 52 22 26 48 16 38z" fill="#DEE8FB"/><path d="M16 38 12 52 26 48z" fill="#fff"/><path d="m12 52 4.5-1.5-3-3z" fill="#0B3BA7"/><path d="M38 16l10 10"/>'),
    rating: 4.6, avaliacoes: 990, estoque: 500, promo: true,
  },
  {
    id: "marca-texto", nome: "Marca-texto Amarelo Neon", unidade: "Unidade",
    preco: 4.50, cat: "papelaria",
    desc: "Marca-texto com tinta neon de alta visibilidade e ponta chanfrada para traços finos ou grossos. Não atravessa o papel.",
    specs: [["Cor", "Amarelo neon"], ["Ponta", "Chanfrada 1–4 mm"], ["Base", "Água"]],
    art: art('<rect x="25" y="8" width="14" height="13" rx="2" fill="#DEE8FB"/><rect x="22" y="21" width="20" height="22" rx="3" fill="#DEE8FB"/><path d="M27 43l2 11h6l2-11" fill="#fff"/>'),
    rating: 4.4, avaliacoes: 410, estoque: 180, novidade: true,
  },
  {
    id: "cola-branca", nome: "Cola Branca Escolar 90g", unidade: "Unidade",
    preco: 3.50, cat: "papelaria",
    desc: "Cola branca lavável, atóxica e de secagem rápida. Indicada para papel, cartolina e trabalhos escolares.",
    specs: [["Conteúdo", "90 g"], ["Lavável", "Sim"], ["Atóxica", "Sim"]],
    art: art('<path d="M30 8h4v6h-4z"/><path d="M26 14h12l2 8H24z" fill="#fff"/><rect x="22" y="22" width="20" height="32" rx="5" fill="#DEE8FB"/><path d="M28 34h8"/>'),
    rating: 4.3, avaliacoes: 220, estoque: 260, maisVendido: true,
  },
  /* ---------- Utilidades ---------- */
  {
    id: "tesoura", nome: "Tesoura Multiuso Inox 13cm", unidade: "Unidade",
    preco: 7.90, precoAntigo: 11.90, cat: "utilidades",
    desc: "Tesoura com lâminas em aço inox e cabo ergonômico. Corte preciso para papel, tecido e uso geral.",
    specs: [["Lâmina", "Aço inox"], ["Tamanho", "13 cm"], ["Cabo", "Ergonômico"]],
    art: art('<circle cx="21" cy="46" r="6" fill="#DEE8FB"/><circle cx="41" cy="49" r="6" fill="#DEE8FB"/><path d="M25 42 47 13"/><path d="M37 45 15 16"/><circle cx="31" cy="30" r="1.6" fill="#0B3BA7"/>'),
    rating: 4.5, avaliacoes: 305, estoque: 90, promo: true,
  },
  {
    id: "garrafa-termica", nome: "Garrafa Térmica 1L Inox", unidade: "Unidade",
    preco: 49.90, cat: "utilidades",
    desc: "Garrafa térmica em aço inox com parede dupla a vácuo. Mantém bebidas quentes por 12h e geladas por 24h. Tampa que vira copo.",
    specs: [["Capacidade", "1 litro"], ["Material", "Aço inox"], ["Conserva quente", "12 horas"], ["Conserva frio", "24 horas"]],
    art: art('<rect x="24" y="20" width="16" height="34" rx="5" fill="#DEE8FB"/><path d="M26 20v-4h12v4"/><rect x="22" y="10" width="20" height="6" rx="2" fill="#fff"/><path d="M28 34h8"/>'),
    rating: 4.7, avaliacoes: 480, estoque: 65, maisVendido: true,
  },
  {
    id: "organizador", nome: "Organizador Multiuso 3 Gavetas", unidade: "Unidade",
    preco: 39.90, cat: "utilidades",
    desc: "Organizador plástico com 3 gavetas deslizantes. Ideal para escritório, banheiro, cozinha ou ateliê — empilhável e resistente.",
    specs: [["Gavetas", "3"], ["Material", "Polipropileno"], ["Empilhável", "Sim"]],
    art: art('<rect x="14" y="12" width="36" height="42" rx="4" fill="#DEE8FB"/><path d="M14 26h36M14 40h36"/><path d="M29 19h6M29 33h6M29 47h6"/>'),
    rating: 4.5, avaliacoes: 210, estoque: 70,
  },
  {
    id: "caixa-organizadora", nome: "Caixa Organizadora 20L com Tampa", unidade: "Unidade",
    preco: 29.90, precoAntigo: 36.90, cat: "utilidades",
    desc: "Caixa organizadora transparente de 20 litros com tampa de travamento. Perfeita para guardar roupas, brinquedos e documentos.",
    specs: [["Capacidade", "20 litros"], ["Tampa", "Com travas"], ["Material", "Plástico resistente"]],
    art: art('<path d="M14 26h36v24a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V26z" fill="#DEE8FB"/><rect x="10" y="18" width="44" height="8" rx="2" fill="#fff"/><path d="M26 36h12"/>'),
    rating: 4.4, avaliacoes: 175, estoque: 110, promo: true,
  },
  /* ---------- Descartáveis ---------- */
  {
    id: "copo-200", nome: "Copo Descartável 200ml c/ 100", unidade: "Pacote",
    preco: 6.90, cat: "descartaveis",
    desc: "Copos descartáveis de 200ml em pacote com 100 unidades. Bordas reforçadas, ideais para festas, escritórios e eventos.",
    specs: [["Volume", "200 ml"], ["Quantidade", "100 unidades"], ["Material", "PP reciclável"]],
    art: art('<path d="M21 12h22l-4 40H25z" fill="#DEE8FB"/><path d="M23.5 22h17M25.5 32h13" stroke="#fff"/>'),
    rating: 4.2, avaliacoes: 150, estoque: 400, maisVendido: true,
  },
  {
    id: "kit-talheres", nome: "Kit Talheres Descartáveis c/ 50", unidade: "Pacote",
    preco: 9.90, cat: "descartaveis",
    desc: "Kit com 50 conjuntos de garfo e faca descartáveis em plástico resistente. Prático para festas, marmitas e delivery.",
    specs: [["Conjuntos", "50"], ["Itens", "Garfo e faca"], ["Material", "PS cristal"]],
    art: art('<path d="M22 10v12a4 4 0 0 0 4 4v28"/><path d="M18 10v8M30 10v8"/><path d="M42 10c-5 3-5 15 0 18v26" fill="#DEE8FB"/>'),
    rating: 4.3, avaliacoes: 95, estoque: 300, novidade: true,
  },
  /* ---------- Brinquedos ---------- */
  {
    id: "carrinho-infantil", nome: "Carrinho Infantil Roda Livre", unidade: "Unidade",
    preco: 24.90, cat: "brinquedos",
    desc: "Carrinho de brinquedo com sistema roda livre e pneus emborrachados. Resistente a quedas, para crianças a partir de 3 anos.",
    specs: [["Idade", "3+ anos"], ["Sistema", "Roda livre"], ["Certificação", "INMETRO"]],
    art: art('<path d="M14 40l6-12h20l10 12" fill="#DEE8FB"/><path d="M10 40h46v8H10z" fill="#DEE8FB"/><circle cx="22" cy="50" r="5" fill="#fff"/><circle cx="44" cy="50" r="5" fill="#fff"/><path d="M30 28v12"/>'),
    rating: 4.6, avaliacoes: 230, estoque: 85, novidade: true,
  },
  {
    id: "boneca-fashion", nome: "Boneca Fashion com Acessórios", unidade: "Unidade",
    preco: 39.90, precoAntigo: 49.90, cat: "brinquedos",
    desc: "Boneca articulada com vestido fashion e acessórios inclusos. Cabelo para pentear e roupas intercambiáveis.",
    specs: [["Altura", "30 cm"], ["Acessórios", "Inclusos"], ["Idade", "3+ anos"], ["Certificação", "INMETRO"]],
    art: art('<circle cx="32" cy="17" r="8" fill="#DEE8FB"/><path d="M22 50l4-18h12l4 18z" fill="#DEE8FB"/><path d="M26 34l-6 8M38 34l6 8"/><path d="M29 20c2 1.5 4 1.5 6 0"/>'),
    rating: 4.8, avaliacoes: 312, estoque: 45, promo: true,
  },
  {
    id: "jogo-educativo", nome: "Jogo Educativo de Encaixe", unidade: "Unidade",
    preco: 34.90, cat: "brinquedos",
    desc: "Jogo de encaixe com peças coloridas que estimulam coordenação motora, lógica e criatividade. Peças grandes e seguras.",
    specs: [["Peças", "48"], ["Idade", "4+ anos"], ["Estimula", "Lógica e coordenação"], ["Certificação", "INMETRO"]],
    art: art('<path d="M14 22h12a6 6 0 1 1 12 0h12v12a6 6 0 1 0 0 12v8H14V22z" fill="#DEE8FB"/>'),
    rating: 4.9, avaliacoes: 188, estoque: 60, novidade: true,
  },
  {
    id: "urso-pelucia", nome: "Urso de Pelúcia 30cm", unidade: "Unidade",
    preco: 49.90, cat: "brinquedos",
    desc: "Urso de pelúcia super macio com enchimento antialérgico. Lavável à mão, o presente que nunca erra.",
    specs: [["Altura", "30 cm"], ["Enchimento", "Antialérgico"], ["Lavável", "Sim"]],
    art: art('<circle cx="21" cy="17" r="6" fill="#DEE8FB"/><circle cx="43" cy="17" r="6" fill="#DEE8FB"/><circle cx="32" cy="27" r="13" fill="#DEE8FB"/><ellipse cx="32" cy="48" rx="13" ry="10" fill="#DEE8FB"/><circle cx="27" cy="25" r="1.5" fill="#0B3BA7"/><circle cx="37" cy="25" r="1.5" fill="#0B3BA7"/><path d="M29 32c2 1.8 4 1.8 6 0"/>'),
    rating: 4.9, avaliacoes: 188, estoque: 35,
  },
  /* ---------- Informática ---------- */
  {
    id: "mouse-usb", nome: "Mouse Óptico USB 1200dpi", unidade: "Unidade",
    preco: 24.90, precoAntigo: 39.90, cat: "informatica",
    desc: "Mouse óptico com fio USB, sensor de 1200dpi e design ambidestro. Plug and play — funciona em qualquer computador.",
    specs: [["Sensor", "Óptico 1200 dpi"], ["Conexão", "USB com fio"], ["Botões", "3"], ["Garantia", "90 dias"]],
    art: art('<rect x="20" y="16" width="24" height="38" rx="12" fill="#DEE8FB"/><path d="M32 24v8"/><path d="M32 16V9c8 0 8-5 14-5"/>'),
    rating: 4.4, avaliacoes: 510, estoque: 60, promo: true, maisVendido: true,
  },
  {
    id: "teclado-usb", nome: "Teclado USB ABNT2", unidade: "Unidade",
    preco: 44.90, precoAntigo: 59.90, cat: "informatica",
    desc: "Teclado com fio USB no padrão ABNT2 (com ç), teclas silenciosas de perfil baixo e apoio resistente a respingos.",
    specs: [["Layout", "ABNT2 (português)"], ["Conexão", "USB com fio"], ["Teclas", "107"], ["Garantia", "90 dias"]],
    art: art('<rect x="10" y="22" width="44" height="22" rx="4" fill="#DEE8FB"/><path d="M16 29h4M24 29h4M32 29h4M40 29h4M16 37h4M24 37h12M40 37h4"/>'),
    rating: 4.5, avaliacoes: 290, estoque: 50, promo: true,
  },
  {
    id: "fone-p2", nome: "Fone de Ouvido P2 com Microfone", unidade: "Unidade",
    preco: 19.90, cat: "informatica",
    desc: "Fone de ouvido com conector P2, microfone embutido e almofadas confortáveis. Compatível com celulares e computadores.",
    specs: [["Conector", "P2 3,5 mm"], ["Microfone", "Embutido"], ["Cabo", "1,2 m"]],
    art: art('<path d="M14 38v-6a18 18 0 0 1 36 0v6"/><rect x="10" y="38" width="11" height="16" rx="5" fill="#DEE8FB"/><rect x="43" y="38" width="11" height="16" rx="5" fill="#DEE8FB"/>'),
    rating: 4.1, avaliacoes: 330, estoque: 75, novidade: true,
  },
  /* ---------- Cosméticos ---------- */
  {
    id: "shampoo", nome: "Shampoo Hidratação Intensa 350ml", unidade: "Unidade",
    preco: 16.90, cat: "cosmeticos",
    desc: "Shampoo de hidratação intensa com queratina e óleo de argan. Limpa suavemente e devolve brilho aos fios.",
    specs: [["Conteúdo", "350 ml"], ["Ativos", "Queratina e argan"], ["Tipo", "Todos os cabelos"]],
    art: art('<rect x="22" y="20" width="20" height="34" rx="5" fill="#DEE8FB"/><path d="M28 20v-5h8v5"/><rect x="26" y="9" width="12" height="6" rx="2" fill="#fff"/><path d="M27 34h10M27 40h10"/>'),
    rating: 4.5, avaliacoes: 240, estoque: 95, maisVendido: true,
  },
  {
    id: "hidratante", nome: "Hidratante Corporal 400ml", unidade: "Unidade",
    preco: 18.90, precoAntigo: 24.90, cat: "cosmeticos",
    desc: "Loção hidratante corporal de rápida absorção com manteiga de karité. Pele macia por 24 horas, sem sensação pegajosa.",
    specs: [["Conteúdo", "400 ml"], ["Ativo", "Manteiga de karité"], ["Absorção", "Rápida"], ["Hidratação", "24 horas"]],
    art: art('<rect x="22" y="26" width="20" height="28" rx="5" fill="#DEE8FB"/><path d="M30 26v-8h4v8"/><path d="M32 18v-6h10v5"/><path d="M28 38h8"/>'),
    rating: 4.6, avaliacoes: 270, estoque: 88, promo: true,
  },
  {
    id: "perfume", nome: "Perfume Colônia 100ml", unidade: "Unidade",
    preco: 59.90, cat: "cosmeticos",
    desc: "Colônia com fragrância marcante de notas amadeiradas e cítricas. Fixação prolongada para o dia a dia.",
    specs: [["Conteúdo", "100 ml"], ["Família olfativa", "Amadeirada cítrica"], ["Fixação", "8 horas"]],
    art: art('<rect x="20" y="24" width="24" height="30" rx="6" fill="#DEE8FB"/><rect x="27" y="16" width="10" height="8" rx="2" fill="#fff"/><path d="M37 14c3-1 5-2 8-2"/><circle cx="47" cy="11" r="2.4" fill="#DEE8FB"/>'),
    rating: 4.7, avaliacoes: 160, estoque: 40, novidade: true,
  },
];
