/* ============================================================
   Paulex Armarinho — Atacado e varejo desde 1984
   ============================================================ */

const WHATSAPP_NUMBER = "5521987578187"; // WhatsApp da loja (55 + DDD + número)
const FRETE_GRATIS_MIN = 99; // valor mínimo para frete grátis

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
    id: "informatica", nome: "Informática",
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
      { de: 1,   ate: 9,        preco: 1.20, off: null },
      { de: 10,  ate: 49,       preco: 1.05, off: "-12%" },
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

const ORDERS = [
  { numero: "12548", data: "02/05/2024", status: "entregue",   rotulo: "Entregue",      total: 149.60 },
  { numero: "12387", data: "18/04/2024", status: "transporte", rotulo: "Em transporte", total: 89.90 },
  { numero: "12045", data: "05/04/2024", status: "entregue",   rotulo: "Entregue",      total: 62.30 },
  { numero: "11899", data: "21/03/2024", status: "cancelado",  rotulo: "Cancelado",     total: 35.40 },
];

const ICON_BOX = icon('<path d="M4 8l8-4 8 4v9l-8 4-8-4V8z"/><path d="M4 8l8 4 8-4M12 12v9"/>');
const ICON_CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>';
const ICON_CART = icon('<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>');

/* ---------- Estado ---------- */
let cart = JSON.parse(localStorage.getItem("paulex_cart") || "{}");
let favs = new Set(JSON.parse(localStorage.getItem("paulex_favs") || "[]"));
let logged = localStorage.getItem("paulex_logged") === "1";
let currentProduct = null;
let productQty = 1;
let currentListKind = "";
let currentSort = "relevancia";

const $ = (sel) => document.querySelector(sel);
const money = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- Preço com desconto por quantidade ---------- */
function unitPrice(p, qty) {
  if (!p.tiers) return p.preco;
  const tier = p.tiers.find((t) => qty >= t.de && qty <= t.ate);
  return tier ? tier.preco : p.preco;
}

/* ============================================================
   ROTEAMENTO — URLs reais (#/produto/caneta-bic), com suporte
   ao botão voltar/avançar do navegador e links compartilháveis
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById("screen-" + id);
  el.classList.add("active");
  window.scrollTo(0, 0);

  if (id === "club") {
    $("#club-points").hidden = !logged;
    $("#club-login-cta").hidden = logged;
  }

  const nav = el.dataset.nav;
  document.querySelectorAll("[data-go]").forEach((b) =>
    b.classList.toggle("active", b.dataset.go === nav)
  );
}

function setRoute(r) {
  if (location.hash === "#" + r) route();
  else location.hash = r;
}

function go(id) { setRoute("/" + id); }
function openList(kind) { setRoute("/lista/" + encodeURIComponent(kind)); }
function openProduct(id) { setRoute("/produto/" + id); }

function back() {
  if (history.length > 1 && location.hash) history.back();
  else go("home");
}

function route() {
  const h = location.hash.replace(/^#\/?/, "");
  const [base, param] = h.split("/");

  if (!base) return showScreen("home");
  if (base === "produto" && PRODUCTS.some((p) => p.id === param)) return renderProduct(param);
  if (base === "lista") return renderList(decodeURIComponent(param || "maisvendidos"));

  const telas = ["home", "categorias", "carrinho", "club", "login", "conta", "pedidos", "enderecos"];
  if (telas.includes(base)) {
    let id = base;
    // Áreas pessoais exigem login (evita exibir dados de demonstração)
    if (["conta", "pedidos", "enderecos"].includes(id) && !logged) id = "login";
    return showScreen(id);
  }
  showScreen("home");
}
window.addEventListener("hashchange", route);

document.querySelectorAll("[data-go]").forEach((b) =>
  b.addEventListener("click", () => go(b.dataset.go))
);

function openWhatsApp(texto) {
  const msg = texto || "Olá, Paulex! Vim pelo site e gostaria de um atendimento.";
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Render: categorias ---------- */
function renderCategories() {
  $("#cat-row").innerHTML = CATEGORIES.map(
    (c) => `
    <button class="cat-chip" onclick="openList('cat:${c.id}')">
      <span>${c.icon}</span>${c.nome}
    </button>`
  ).join("");

  $("#cat-list").innerHTML = CATEGORIES.map(
    (c) => `
    <button class="cat-card" onclick="openList('cat:${c.id}')">
      <span class="cat-ico">${c.icon}</span>
      <div><strong>${c.nome}</strong><small>${c.desc}</small></div>
      ${ICON_CHEV}
    </button>`
  ).join("");

  $("#foot-cats").innerHTML = CATEGORIES.map(
    (c) => `<button onclick="openList('cat:${c.id}')">${c.nome}</button>`
  ).join("");
}

/* ---------- Render: cards de produto ---------- */
function productCard(p) {
  const tag = p.promo
    ? `<span class="tag">OFERTA</span>`
    : p.novidade
    ? `<span class="tag new">NOVO</span>`
    : "";
  const old = p.precoAntigo ? `<span class="old">${money(p.precoAntigo)}</span>` : "";
  return `
    <div class="card" onclick="openProduct('${p.id}')" role="button" tabindex="0">
      <div class="ph">${tag}${p.art}</div>
      <div class="info">
        <span class="name">${p.nome}</span>
        ${old}
        <span class="price${p.precoAntigo ? " red" : ""}">${money(p.preco)}</span>
        <button class="add" aria-label="Adicionar ${p.nome} ao carrinho"
          onclick="event.stopPropagation(); quickAdd('${p.id}')">${ICON_CART} Adicionar</button>
      </div>
    </div>`;
}

function renderHome() {
  $("#home-grid").innerHTML =
    PRODUCTS.filter((p) => p.maisVendido).map(productCard).join("");
  $("#promo-grid").innerHTML =
    PRODUCTS.filter((p) => p.promo).slice(0, 4).map(productCard).join("");
}

/* ---------- Busca com sugestões instantâneas ---------- */
const searchInput = $("#search-input");
const suggest = $("#suggest");

function renderSuggest(term) {
  const q = term.trim().toLowerCase();
  if (q.length < 2) { suggest.hidden = true; return; }
  const hits = PRODUCTS.filter((p) => p.nome.toLowerCase().includes(q)).slice(0, 6);
  if (!hits.length) {
    suggest.innerHTML = `<div class="sug-empty">Nenhum produto encontrado para “${term}”.</div>`;
  } else {
    suggest.innerHTML = hits.map((p) => `
      <button class="sug" onclick="suggestGo('${p.id}')">
        <span class="sug-art">${p.art}</span>
        <span class="sug-name">${p.nome}</span>
        <span class="sug-price">${money(p.preco)}</span>
      </button>`).join("");
  }
  suggest.hidden = false;
}

function suggestGo(id) {
  suggest.hidden = true;
  searchInput.value = "";
  openProduct(id);
}

searchInput.addEventListener("input", (e) => renderSuggest(e.target.value));
searchInput.addEventListener("focus", (e) => renderSuggest(e.target.value));
searchInput.addEventListener("keydown", (e) => { if (e.key === "Escape") suggest.hidden = true; });
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) suggest.hidden = true;
});

/* ---------- Lista (categoria / ofertas / favoritos) ---------- */
function listFor(kind) {
  if (kind.startsWith("cat:")) {
    const cat = CATEGORIES.find((c) => c.id === kind.slice(4));
    return { title: cat ? cat.nome : "Produtos", list: PRODUCTS.filter((p) => p.cat === (cat && cat.id)) };
  }
  if (kind === "promocoes" || kind === "ofertas")
    return { title: "Promoções", list: PRODUCTS.filter((p) => p.promo) };
  if (kind === "novidades")
    return { title: "Novidades", list: PRODUCTS.filter((p) => p.novidade) };
  if (kind === "favoritos")
    return { title: "Favoritos", list: PRODUCTS.filter((p) => favs.has(p.id)) };
  return { title: "Mais vendidos", list: PRODUCTS.filter((p) => p.maisVendido) };
}

function sortedList(list) {
  const l = [...list];
  if (currentSort === "menor") l.sort((a, b) => a.preco - b.preco);
  if (currentSort === "maior") l.sort((a, b) => b.preco - a.preco);
  if (currentSort === "avaliados") l.sort((a, b) => b.avaliacoes - a.avaliacoes);
  return l;
}

function renderList(kind) {
  if (kind !== currentListKind) currentSort = "relevancia";
  currentListKind = kind;

  const { title, list } = listFor(kind);
  $("#list-title").textContent = title;
  $("#list-grid").innerHTML = sortedList(list).map(productCard).join("");
  $("#list-empty").hidden = list.length > 0;
  $("#sort-row").hidden = list.length < 2;
  $("#sort-row").querySelectorAll(".sort").forEach((b) =>
    b.classList.toggle("active", b.dataset.sort === currentSort)
  );
  showScreen("list");
}

function sortBy(btn) {
  currentSort = btn.dataset.sort;
  renderList(currentListKind);
}

/* ---------- Favoritos ---------- */
function toggleFav() {
  const id = currentProduct.id;
  if (favs.has(id)) { favs.delete(id); toast("Removido dos favoritos"); }
  else { favs.add(id); toast("Salvo nos favoritos ❤"); }
  localStorage.setItem("paulex_favs", JSON.stringify([...favs]));
  updateFavBtn();
}

function updateFavBtn() {
  $("#p-fav").classList.toggle("fav-on", !!currentProduct && favs.has(currentProduct.id));
}

/* ---------- Produto ---------- */
function renderProduct(id) {
  currentProduct = PRODUCTS.find((p) => p.id === id);
  productQty = 1;
  const p = currentProduct;

  $("#p-photo").innerHTML = p.art;
  $("#p-name").textContent = p.nome;
  $("#p-unit").textContent = p.unidade;
  const full = Math.round(p.rating);
  $("#p-stars").innerHTML =
    "★".repeat(full) + "☆".repeat(5 - full) +
    ` <small>${p.rating.toFixed(1)} (${p.avaliacoes.toLocaleString("pt-BR")} avaliações)</small>`;
  $("#p-price").innerHTML =
    money(p.preco) + (p.precoAntigo ? `<small>${money(p.precoAntigo)}</small>` : "");
  $("#p-price").classList.toggle("red", !!p.precoAntigo);
  $("#p-stock").innerHTML =
    `● Em estoque <span>· ${p.estoque} unidades disponíveis</span>`;
  $("#p-desc").textContent = p.desc;

  $("#p-specs-body").innerHTML = p.specs
    .map(([k, v]) => `<div class="spec"><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");

  if (p.tiers) {
    $("#p-tiers").hidden = false;
    $("#p-tiers-body").innerHTML = p.tiers.map((t) => {
      const faixa = t.ate === Infinity ? `${t.de}+ unidades` : `${t.de} a ${t.ate} unidades`;
      return `<tr><td>${faixa}</td><td>${money(t.preco)}</td><td class="off">${t.off || ""}</td></tr>`;
    }).join("");
  } else {
    $("#p-tiers").hidden = true;
  }

  // Produtos relacionados (mesma categoria)
  const rel = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  $("#p-related-wrap").hidden = rel.length === 0;
  $("#p-related").innerHTML = rel.map(productCard).join("");

  updateFavBtn();
  updateProductTotal();
  showScreen("produto");
}

function pQty(delta) {
  productQty = Math.max(1, Math.min(currentProduct.estoque, productQty + delta));
  updateProductTotal();
}

function updateProductTotal() {
  const p = currentProduct;
  const unit = unitPrice(p, productQty);
  const total = unit * productQty;
  const economia = (p.preco - unit) * productQty;

  $("#p-qty").textContent = productQty;
  $("#p-total-label").textContent =
    `Total (${productQty} ${productQty > 1 ? "unidades" : "unidade"})`;
  $("#p-total").textContent = money(total);
  $("#p-save").hidden = economia <= 0.005;
  $("#p-save").textContent = `Economize ${money(economia)}`;
}

/* ---------- Carrinho ---------- */
function saveCart() {
  localStorage.setItem("paulex_cart", JSON.stringify(cart));
  updateBadges();
}

function updateBadges() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.querySelectorAll(".cart-badge").forEach((b) => {
    b.textContent = count;
    b.style.display = count ? "" : "none";
  });
}

function quickAdd(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  toast("Adicionado ao carrinho ✓");
}

function addToCart() {
  cart[currentProduct.id] = (cart[currentProduct.id] || 0) + productQty;
  saveCart();
  toast("Adicionado ao carrinho ✓");
}

function buyNow() {
  addToCart();
  go("carrinho");
}

function cartQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function clearCart() {
  if (!Object.keys(cart).length) return;
  if (confirm("Esvaziar o carrinho?")) {
    cart = {};
    saveCart();
    renderCart();
  }
}

function cartTotals() {
  let cheio = 0, total = 0, itens = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) continue;
    cheio += p.preco * qty;
    total += unitPrice(p, qty) * qty;
    itens += qty;
  }
  return { cheio, total, desconto: cheio - total, itens };
}

function renderCart() {
  const wrap = $("#cart-items");
  const entries = Object.entries(cart).filter(([id]) => PRODUCTS.some((p) => p.id === id));
  const vazio = entries.length === 0;

  $("#cart-empty").hidden = !vazio;
  $("#cart-summary").style.display = vazio ? "none" : "";

  wrap.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    const unit = unitPrice(p, qty);
    return `
      <div class="cart-item">
        <div class="ph">${p.art}</div>
        <div class="info">
          <strong>${p.nome}</strong>
          <small>${qty} ${qty > 1 ? "unidades" : "unidade"} · ${money(unit)} cada</small>
        </div>
        <div class="stepper">
          <button onclick="cartQty('${id}',-1)" aria-label="Diminuir">−</button>
          <output>${qty}</output>
          <button onclick="cartQty('${id}',1)" aria-label="Aumentar">+</button>
        </div>
        <div class="line-price">${money(unit * qty)}</div>
      </div>`;
  }).join("");

  if (!vazio) {
    const t = cartTotals();
    $("#cart-subtotal-label").textContent =
      `Subtotal (${t.itens} ${t.itens > 1 ? "itens" : "item"})`;
    $("#cart-subtotal").textContent = money(t.cheio);
    $("#cart-discount-row").style.display = t.desconto > 0.005 ? "" : "none";
    $("#cart-discount").textContent = "-" + money(t.desconto);
    $("#cart-total").textContent = money(t.total);

    const gratis = t.total >= FRETE_GRATIS_MIN;
    const falta = FRETE_GRATIS_MIN - t.total;
    const msg = $("#ship-msg");
    const fill = $("#ship-fill");
    msg.textContent = gratis
      ? "Você ganhou frete grátis!"
      : `Faltam ${money(falta)} para o frete grátis`;
    msg.classList.toggle("done", gratis);
    fill.classList.toggle("done", gratis);
    fill.style.width = Math.min(100, (t.total / FRETE_GRATIS_MIN) * 100) + "%";

    const frete = $("#cart-frete");
    frete.textContent = gratis ? "Grátis" : "A calcular";
    frete.className = gratis ? "green" : "muted";
  }
}

function cartMessage() {
  const linhas = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return `• ${qty}x ${p.nome} — ${money(unitPrice(p, qty) * qty)}`;
  });
  const t = cartTotals();
  return `Olá, Paulex! Quero fazer um pedido:\n\n${linhas.join("\n")}\n\nTotal: ${money(t.total)}`;
}

function checkoutWhatsApp() {
  if (!Object.keys(cart).length) return toast("Seu carrinho está vazio");
  openWhatsApp(cartMessage());
}

/* ---------- Pedidos ---------- */
function renderOrders(filtro = "todos") {
  const map = { andamento: ["transporte"], entregues: ["entregue"], cancelados: ["cancelado"] };
  const list = filtro === "todos"
    ? ORDERS
    : ORDERS.filter((o) => map[filtro].includes(o.status));

  $("#orders").innerHTML = list.map((o) => `
    <div class="order">
      <span class="o-ico">${ICON_BOX}</span>
      <div class="o-main">
        <strong>Pedido #${o.numero}</strong>
        <small>${o.data}</small>
      </div>
      <div class="o-side">
        <span class="status ${o.status}">${o.rotulo}</span>
        <strong>${money(o.total)}</strong>
        <button class="link">Ver detalhes ›</button>
      </div>
    </div>`).join("");
  $("#orders-empty").hidden = list.length > 0;
}

function orderTab(btn, filtro) {
  $("#order-tabs").querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  renderOrders(filtro);
}

/* ---------- Login ---------- */
function loginTab(btn, qual) {
  $("#login-tabs").querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  $("#form-entrar").hidden = qual !== "entrar";
  $("#form-cadastrar").hidden = qual !== "cadastrar";
}

function doLogin(e) {
  e.preventDefault();
  logged = true;
  localStorage.setItem("paulex_logged", "1");
  toast("Bem-vindo à Paulex!");
  setRoute("/conta");
}

function logout() {
  logged = false;
  localStorage.removeItem("paulex_logged");
  toast("Você saiu da sua conta");
  setRoute("/login");
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Revelação suave ao rolar ---------- */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section, .trust, .footer").forEach((el) => {
    el.classList.add("reveal");
    obs.observe(el);
  });
}

/* ---------- Init ---------- */
renderCategories();
renderHome();
renderCart();
renderOrders();
updateBadges();
route();

setTimeout(() => $("#splash").classList.add("hide"), 1800);
