/* ============ Paulex — Papelaria desde 1984 ============ */

const WHATSAPP_NUMBER = "5511999999999"; // troque pelo número da loja
const FRETE_GRATIS_MIN = 99; // valor mínimo para frete grátis

const CATEGORIES = [
  { id: "papelaria",    nome: "Papelaria",    desc: "Cadernos, canetas, lápis e muito mais", emoji: "✏️" },
  { id: "utilidades",   nome: "Utilidades",   desc: "Produtos para o dia a dia e organização", emoji: "🏠" },
  { id: "descartaveis", nome: "Descartáveis", desc: "Copos, pratos, talheres e embalagens", emoji: "🥤" },
  { id: "brinquedos",   nome: "Brinquedos",   desc: "Diversão para todas as idades", emoji: "🧸" },
  { id: "informatica",  nome: "Informática",  desc: "Acessórios, periféricos e muito mais", emoji: "💻" },
  { id: "cosmeticos",   nome: "Cosméticos",   desc: "Beleza e cuidados pessoais", emoji: "🧴" },
];

const PRODUCTS = [
  {
    id: "caneta-bic", nome: "Caneta BIC Cristal Azul", unidade: "Unidade",
    preco: 1.20, cat: "papelaria", emoji: "🖊️",
    rating: 4.5, avaliacoes: 1256, estoque: 350,
    maisVendido: true, promo: false,
    tiers: [
      { de: 1,   ate: 9,        preco: 1.20, off: null },
      { de: 10,  ate: 49,       preco: 1.05, off: "-12%" },
      { de: 50,  ate: 99,       preco: 0.99, off: "-18%" },
      { de: 100, ate: Infinity, preco: 0.89, off: "-25%" },
    ],
  },
  {
    id: "caderno-tilibra", nome: "Caderno Tilibra 10 Matérias", unidade: "Unidade",
    preco: 34.90, cat: "papelaria", emoji: "📓",
    rating: 4.8, avaliacoes: 842, estoque: 120, maisVendido: true,
  },
  {
    id: "papel-chamex", nome: "Papel Sulfite A4 Chamex 500 fls", unidade: "Pacote",
    preco: 27.90, cat: "papelaria", emoji: "📄",
    rating: 4.7, avaliacoes: 2310, estoque: 200, maisVendido: true,
  },
  {
    id: "lapis-faber", nome: "Lápis HB Faber-Castell", unidade: "Unidade",
    preco: 1.00, precoAntigo: 1.50, cat: "papelaria", emoji: "✏️",
    rating: 4.6, avaliacoes: 990, estoque: 500, promo: true,
  },
  {
    id: "marca-texto", nome: "Marca-texto Amarelo Neon", unidade: "Unidade",
    preco: 4.50, cat: "papelaria", emoji: "🖍️",
    rating: 4.4, avaliacoes: 410, estoque: 180, novidade: true,
  },
  {
    id: "tesoura", nome: "Tesoura Escolar Inox 13cm", unidade: "Unidade",
    preco: 7.90, precoAntigo: 11.90, cat: "utilidades", emoji: "✂️",
    rating: 4.5, avaliacoes: 305, estoque: 90, promo: true,
  },
  {
    id: "cola-branca", nome: "Cola Branca Escolar 90g", unidade: "Unidade",
    preco: 3.50, cat: "papelaria", emoji: "🧪",
    rating: 4.3, avaliacoes: 220, estoque: 260, maisVendido: true,
  },
  {
    id: "copo-200", nome: "Copo Descartável 200ml c/ 100", unidade: "Pacote",
    preco: 6.90, cat: "descartaveis", emoji: "🥤",
    rating: 4.2, avaliacoes: 150, estoque: 400,
  },
  {
    id: "mouse-usb", nome: "Mouse Óptico USB", unidade: "Unidade",
    preco: 24.90, precoAntigo: 39.90, cat: "informatica", emoji: "🖱️",
    rating: 4.4, avaliacoes: 510, estoque: 60, promo: true,
  },
  {
    id: "fone-p2", nome: "Fone de Ouvido P2", unidade: "Unidade",
    preco: 19.90, cat: "informatica", emoji: "🎧",
    rating: 4.1, avaliacoes: 330, estoque: 75, novidade: true,
  },
  {
    id: "urso-pelucia", nome: "Urso de Pelúcia 30cm", unidade: "Unidade",
    preco: 49.90, cat: "brinquedos", emoji: "🧸",
    rating: 4.9, avaliacoes: 188, estoque: 35, novidade: true,
  },
  {
    id: "hidratante", nome: "Hidratante Corporal 400ml", unidade: "Unidade",
    preco: 18.90, precoAntigo: 24.90, cat: "cosmeticos", emoji: "🧴",
    rating: 4.6, avaliacoes: 270, estoque: 88, promo: true,
  },
];

const ORDERS = [
  { numero: "12548", data: "02/05/2024", status: "entregue",   rotulo: "Entregue",      total: 149.60 },
  { numero: "12387", data: "18/04/2024", status: "transporte", rotulo: "Em transporte", total: 89.90 },
  { numero: "12045", data: "05/04/2024", status: "entregue",   rotulo: "Entregue",      total: 62.30 },
  { numero: "11899", data: "21/03/2024", status: "cancelado",  rotulo: "Cancelado",     total: 35.40 },
];

/* ---------- Estado ---------- */
let cart = JSON.parse(localStorage.getItem("paulex_cart") || "{}");
let logged = localStorage.getItem("paulex_logged") === "1";
let currentProduct = null;
let productQty = 1;
const historyStack = [];

const $ = (sel) => document.querySelector(sel);
const money = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------- Preço com desconto por quantidade ---------- */
function unitPrice(p, qty) {
  if (!p.tiers) return p.preco;
  const tier = p.tiers.find((t) => qty >= t.de && qty <= t.ate);
  return tier ? tier.preco : p.preco;
}

/* ---------- Navegação ---------- */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById("screen-" + id);
  el.classList.add("active");
  window.scrollTo(0, 0);

  const nav = el.dataset.nav;
  document.querySelectorAll("[data-go]").forEach((b) =>
    b.classList.toggle("active", b.dataset.go === nav)
  );
}

function go(id, push = true) {
  // Áreas pessoais exigem login (evita exibir dados de demonstração)
  if (["conta", "club", "pedidos", "enderecos"].includes(id) && !logged) id = "login";
  const current = document.querySelector(".screen.active");
  if (push && current) historyStack.push(current.id.replace("screen-", ""));
  show(id);
}

function back() {
  const prev = historyStack.pop() || "home";
  show(prev);
}

document.querySelectorAll("[data-go]").forEach((b) =>
  b.addEventListener("click", () => go(b.dataset.go))
);

/* ---------- Render: categorias ---------- */
function renderCategories() {
  $("#cat-row").innerHTML = CATEGORIES.map(
    (c) => `
    <button class="cat-chip" onclick="openList('cat:${c.id}')">
      <span>${c.emoji}</span>${c.nome}
    </button>`
  ).join("");

  $("#cat-list").innerHTML = CATEGORIES.map(
    (c) => `
    <button class="cat-card" onclick="openList('cat:${c.id}')">
      <span class="cat-ico">${c.emoji}</span>
      <div><strong>${c.nome}</strong><small>${c.desc}</small></div>
      <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>
    </button>`
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
      <div class="ph">${tag}${p.emoji}</div>
      <div class="info">
        <span class="name">${p.nome}</span>
        ${old}
        <span class="price${p.precoAntigo ? " red" : ""}">${money(p.preco)}</span>
        <button class="add" aria-label="Adicionar ${p.nome}"
          onclick="event.stopPropagation(); quickAdd('${p.id}')">+</button>
      </div>
    </div>`;
}

function renderHome(filter = "") {
  const term = filter.trim().toLowerCase();
  const list = term
    ? PRODUCTS.filter((p) => p.nome.toLowerCase().includes(term))
    : PRODUCTS.filter((p) => p.maisVendido);
  $("#home-grid").innerHTML = list.length
    ? list.map(productCard).join("")
    : `<p class="empty" style="grid-column:1/-1">Nenhum produto encontrado.</p>`;
}

$("#search-input").addEventListener("input", (e) => renderHome(e.target.value));

/* ---------- Lista (categoria / ofertas / etc.) ---------- */
function openList(kind) {
  let title = "Produtos";
  let list = PRODUCTS;

  if (kind.startsWith("cat:")) {
    const cat = CATEGORIES.find((c) => c.id === kind.slice(4));
    title = cat.nome;
    list = PRODUCTS.filter((p) => p.cat === cat.id);
  } else if (kind === "promocoes" || kind === "ofertas") {
    title = "Promoções";
    list = PRODUCTS.filter((p) => p.promo);
  } else if (kind === "maisvendidos") {
    title = "Mais vendidos";
    list = PRODUCTS.filter((p) => p.maisVendido);
  } else if (kind === "novidades") {
    title = "Novidades";
    list = PRODUCTS.filter((p) => p.novidade);
  }

  $("#list-title").textContent = title;
  $("#list-grid").innerHTML = list.map(productCard).join("");
  $("#list-empty").hidden = list.length > 0;
  go("list");
}

/* ---------- Produto ---------- */
function openProduct(id) {
  currentProduct = PRODUCTS.find((p) => p.id === id);
  productQty = 1;
  const p = currentProduct;

  $("#p-photo").textContent = p.emoji;
  $("#p-name").textContent = p.nome;
  $("#p-unit").textContent = p.unidade;
  const full = Math.round(p.rating);
  $("#p-stars").innerHTML =
    "★".repeat(full) + "☆".repeat(5 - full) +
    ` <small>(${p.avaliacoes.toLocaleString("pt-BR")} avaliações)</small>`;
  $("#p-price").innerHTML =
    money(p.preco) + (p.precoAntigo ? `<small>${money(p.precoAntigo)}</small>` : "");
  $("#p-price").classList.toggle("red", !!p.precoAntigo);
  $("#p-stock").innerHTML =
    `● Em estoque <span>· ${p.estoque} unidades disponíveis</span>`;

  if (p.tiers) {
    $("#p-tiers").hidden = false;
    $("#p-tiers-body").innerHTML = p.tiers.map((t) => {
      const faixa = t.ate === Infinity ? `${t.de}+ unidades` : `${t.de} a ${t.ate} unidades`;
      return `<tr><td>${faixa}</td><td>${money(t.preco)}</td><td class="off">${t.off || ""}</td></tr>`;
    }).join("");
  } else {
    $("#p-tiers").hidden = true;
  }

  updateProductTotal();
  go("produto");
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
        <div class="ph">${p.emoji}</div>
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
      ? "🎉 Você ganhou frete grátis!"
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
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cartMessage())}`;
  window.open(url, "_blank");
}

/* ---------- Pedidos ---------- */
function renderOrders(filtro = "todos") {
  const map = { andamento: ["transporte"], entregues: ["entregue"], cancelados: ["cancelado"] };
  const list = filtro === "todos"
    ? ORDERS
    : ORDERS.filter((o) => map[filtro].includes(o.status));

  $("#orders").innerHTML = list.map((o) => `
    <div class="order">
      <span class="o-ico">📦</span>
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
  toast("Bem-vindo à Paulex! 💙");
  show("conta");
}

function logout() {
  logged = false;
  localStorage.removeItem("paulex_logged");
  toast("Você saiu da sua conta");
  show("login");
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

/* ---------- Init ---------- */
renderCategories();
renderHome();
renderCart();
renderOrders();
updateBadges();

setTimeout(() => $("#splash").classList.add("hide"), 1800);
