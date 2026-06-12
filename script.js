/* ============================================================
   Paulex Armarinho — script.js (lógica do site)
   Os produtos e categorias ficam em produtos.js
   ============================================================ */

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

  renderReviews(p);
  updateFavBtn();
  updateProductTotal();
  showScreen("produto");
}

/* ---------- Resumo de avaliações ---------- */
function renderReviews(p) {
  const full = Math.round(p.rating);
  $("#p-rev-score").textContent = p.rating.toFixed(1).replace(".", ",");
  $("#p-rev-stars").textContent = "★".repeat(full) + "☆".repeat(5 - full);
  $("#p-rev-count").textContent =
    `${p.avaliacoes.toLocaleString("pt-BR")} avaliações`;

  // distribuição aproximada a partir da nota média
  const r = p.rating;
  const pesos = [
    Math.max(0.02, (r - 3) / 2),
    Math.max(0.05, (r - 2.5) / 4),
    Math.max(0.005, 0.12 - (r - 4) * 0.06),
    Math.max(0.005, 0.06 - (r - 4) * 0.04),
    Math.max(0.005, 0.04 - (r - 4) * 0.03),
  ];
  const total = pesos.reduce((a, b) => a + b, 0);
  $("#p-rev-bars").innerHTML = pesos.map((w, i) => {
    const pct = Math.round((w / total) * 100);
    return `
      <div class="rev-row">
        <span>${5 - i}★</span>
        <div class="rev-bar"><span style="width:${pct}%"></span></div>
        <small>${pct}%</small>
      </div>`;
  }).join("");
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

  // Continue comprando: sugestões fora do carrinho
  const sugestoes = PRODUCTS
    .filter((p) => !cart[p.id])
    .sort((a, b) => (b.maisVendido === true) - (a.maisVendido === true) || b.avaliacoes - a.avaliacoes)
    .slice(0, 8);
  $("#cart-suggest").hidden = vazio || sugestoes.length === 0;
  $("#cart-suggest-row").innerHTML = sugestoes.map((p) => `
    <button class="mini-card" onclick="openProduct('${p.id}')">
      <span class="mini-art">${p.art}</span>
      <span class="mini-name">${p.nome}</span>
      <span class="mini-price">${money(p.preco)}</span>
      <span class="mini-add" role="button" aria-label="Adicionar ${p.nome}"
        onclick="event.stopPropagation(); quickAdd('${p.id}'); renderCart()">+</span>
    </button>`).join("");
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
