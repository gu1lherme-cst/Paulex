/* ============================================================
   Paulex Armarinho — script.js (lógica do site)
   Os produtos e categorias ficam em produtos.js
   ============================================================ */

/* Pedidos reais do cliente, salvos no navegador */
let myOrders = JSON.parse(localStorage.getItem("paulex_orders") || "[]");
const saveOrders = () => localStorage.setItem("paulex_orders", JSON.stringify(myOrders));

/* Endereços do cliente, salvos no navegador */
let addrs = JSON.parse(localStorage.getItem("paulex_addrs") || "[]");
const saveAddrsLS = () => localStorage.setItem("paulex_addrs", JSON.stringify(addrs));

const STATUS_INFO = {
  aguardando: { rotulo: "Aguardando confirmação", classe: "transporte" },
  entregue:   { rotulo: "Recebido",               classe: "entregue" },
  cancelado:  { rotulo: "Cancelado",              classe: "cancelado" },
};

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
    $("#club-detail").hidden = true;
    renderClub();
  }
  if (id === "home") renderRecent();
  if (id === "carrinho") renderCart();
  if (id === "pedidos") renderOrders(currentOrderTab);
  if (id === "enderecos") { renderAddrs(); hideAddrForm(); }

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

  const telas = ["home", "categorias", "carrinho", "club", "login", "conta", "pedidos", "enderecos", "privacidade", "termos"];
  if (telas.includes(base)) {
    // Áreas pessoais exigem login (a URL passa a refletir a tela exibida)
    if (["conta", "pedidos", "enderecos"].includes(base) && !logged) {
      location.replace("#/login");
      return;
    }
    return showScreen(base);
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
  pushRecent(p.id);
  showScreen("produto");
}

/* ---------- Vistos recentemente ---------- */
function pushRecent(id) {
  const rec = JSON.parse(localStorage.getItem("paulex_recent") || "[]").filter((x) => x !== id);
  rec.unshift(id);
  localStorage.setItem("paulex_recent", JSON.stringify(rec.slice(0, 8)));
}

function renderRecent() {
  const rec = JSON.parse(localStorage.getItem("paulex_recent") || "[]")
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);
  $("#recent-section").hidden = rec.length === 0;
  $("#recent-row").innerHTML = rec.map((p) => `
    <button class="mini-card" onclick="openProduct('${p.id}')">
      <span class="mini-art">${p.art}</span>
      <span class="mini-name">${p.nome}</span>
      <span class="mini-price">${money(p.preco)}</span>
    </button>`).join("");
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

/* ---------- Cupom de desconto ---------- */
let cupom = localStorage.getItem("paulex_cupom") || "";
if (!CUPONS[cupom]) cupom = "";

function applyCupom() {
  const cod = $("#coupon-input").value.trim().toUpperCase();
  if (!cod) return;
  if (!CUPONS[cod]) {
    toast("Cupom inválido ou expirado");
    return;
  }
  cupom = cod;
  localStorage.setItem("paulex_cupom", cupom);
  toast(`Cupom ${cod} aplicado!`);
  $("#coupon-input").value = "";
  renderCart();
}

function removeCupom() {
  cupom = "";
  localStorage.removeItem("paulex_cupom");
  renderCart();
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
  const cupomVal = CUPONS[cupom] ? total * (CUPONS[cupom].desconto / 100) : 0;
  return { cheio, total: total - cupomVal, desconto: cheio - total, cupomVal, itens };
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

    const temCupom = !!CUPONS[cupom];
    $("#coupon-form").hidden = temCupom;
    $("#cart-coupon-row").hidden = !temCupom;
    if (temCupom) {
      $("#cart-coupon-label").innerHTML =
        `Cupom <strong>${cupom}</strong> (${CUPONS[cupom].descricao}) ` +
        `<button class="coupon-remove" onclick="removeCupom()" aria-label="Remover cupom">remover</button>`;
      $("#cart-coupon").textContent = "-" + money(t.cupomVal);
    }

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
  const cupomLinha = CUPONS[cupom]
    ? `\nCupom ${cupom} (${CUPONS[cupom].descricao}): -${money(t.cupomVal)}`
    : "";
  return `Olá, Paulex! Quero fazer um pedido:\n\n${linhas.join("\n")}${cupomLinha}\n\nTotal: ${money(t.total)}`;
}

function checkoutWhatsApp() {
  if (!Object.keys(cart).length) return toast("Seu carrinho está vazio");
  const msg = cartMessage();
  const t = cartTotals();
  const numero = String(1001 + myOrders.length);
  myOrders.unshift({
    numero,
    data: new Date().toLocaleDateString("pt-BR"),
    status: "aguardando",
    total: t.total,
    itens: Object.entries(cart).map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return { id, nome: p.nome, qty, valor: unitPrice(p, qty) * qty };
    }),
  });
  saveOrders();
  openWhatsApp(`${msg}\n\nPedido nº ${numero}`);
  cart = {};
  removeCupom();
  saveCart();
  renderCart();
  toast(`Pedido #${numero} registrado!`);
}

/* ---------- Pedidos (reais, salvos no aparelho) ---------- */
let currentOrderTab = "todos";
const openOrders = new Set();

function renderOrders(filtro = currentOrderTab) {
  currentOrderTab = filtro;
  const map = { andamento: ["aguardando"], entregues: ["entregue"], cancelados: ["cancelado"] };
  const list = filtro === "todos"
    ? myOrders
    : myOrders.filter((o) => map[filtro].includes(o.status));

  $("#orders").innerHTML = list.map((o) => {
    const st = STATUS_INFO[o.status];
    const aberto = openOrders.has(o.numero);
    const itens = (o.itens || []).map((i) =>
      `<div class="o-item"><span>${i.qty}x ${i.nome}</span><span>${money(i.valor)}</span></div>`
    ).join("");
    const acoes = `
      <div class="o-actions">
        <button class="pill pill-outline" onclick="orderRepeat('${o.numero}')">Repetir pedido</button>
        ${o.status === "aguardando" ? `
          <button class="pill pill-blue" onclick="orderStatus('${o.numero}','entregue')">Marcar como recebido</button>
          <button class="link" onclick="orderStatus('${o.numero}','cancelado')">Cancelar pedido</button>` : ""}
      </div>`;
    return `
    <div class="order-wrap">
      <button class="order" onclick="toggleOrder('${o.numero}')" aria-expanded="${aberto}">
        <span class="o-ico">${ICON_BOX}</span>
        <div class="o-main">
          <strong>Pedido #${o.numero}</strong>
          <small>${o.data} · ${(o.itens || []).length} ${(o.itens || []).length === 1 ? "item" : "itens"}</small>
        </div>
        <div class="o-side">
          <span class="status ${st.classe}">${st.rotulo}</span>
          <strong>${money(o.total)}</strong>
          <span class="link">${aberto ? "Fechar ‹" : "Ver detalhes ›"}</span>
        </div>
      </button>
      <div class="o-det" ${aberto ? "" : "hidden"}>${itens}${acoes}</div>
    </div>`;
  }).join("");
  $("#orders-empty").hidden = list.length > 0;
}

function toggleOrder(n) {
  openOrders.has(n) ? openOrders.delete(n) : openOrders.add(n);
  renderOrders();
}

function orderStatus(n, status) {
  const o = myOrders.find((x) => x.numero === n);
  if (!o) return;
  if (status === "cancelado" && !confirm(`Cancelar o pedido #${n}?`)) return;
  o.status = status;
  saveOrders();
  renderOrders();
  toast(status === "entregue" ? "Que bom que chegou! 📦" : "Pedido cancelado");
}

function orderRepeat(n) {
  const o = myOrders.find((x) => x.numero === n);
  if (!o) return;
  (o.itens || []).forEach((i) => {
    if (PRODUCTS.some((p) => p.id === i.id)) cart[i.id] = (cart[i.id] || 0) + i.qty;
  });
  saveCart();
  go("carrinho");
  toast("Itens adicionados ao carrinho");
}

function orderTab(btn, filtro) {
  $("#order-tabs").querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  renderOrders(filtro);
}

/* ---------- Paulex Club (pontos calculados dos pedidos) ---------- */
function clubPoints() {
  return Math.floor(
    myOrders.filter((o) => o.status !== "cancelado").reduce((a, o) => a + o.total, 0)
  );
}

function clubLevel(p) {
  if (p >= 5000) return { nome: "Ouro", cashback: 3, base: 5000, prox: null };
  if (p >= 1000) return { nome: "Prata", cashback: 2, base: 1000, prox: { nome: "Ouro", pts: 5000 } };
  return { nome: "Bronze", cashback: 1, base: 0, prox: { nome: "Prata", pts: 1000 } };
}

function renderClub() {
  const pts = clubPoints();
  const lv = clubLevel(pts);

  $("#club-pts").innerHTML = `${pts.toLocaleString("pt-BR")} <span>pts</span>`;
  if (lv.prox) {
    $("#club-next-msg").textContent =
      pts === 0
        ? "Faça seu primeiro pedido para começar a pontuar"
        : `Faltam ${(lv.prox.pts - pts).toLocaleString("pt-BR")} pts para o nível ${lv.prox.nome}`;
    $("#club-fill").style.width =
      Math.min(100, ((pts - lv.base) / (lv.prox.pts - lv.base)) * 100) + "%";
    $("#club-lv-a").textContent = lv.nome;
    $("#club-lv-b").textContent = lv.prox.nome;
  } else {
    $("#club-next-msg").textContent = "Você está no nível máximo. Obrigado pela parceria!";
    $("#club-fill").style.width = "100%";
    $("#club-lv-a").textContent = "Ouro";
    $("#club-lv-b").textContent = "★";
  }

  document.querySelectorAll(".level").forEach((el) =>
    el.classList.toggle("featured", el.dataset.level === lv.nome)
  );
}

function clubDetail(tipo) {
  const det = $("#club-detail");
  const pts = clubPoints();
  const lv = clubLevel(pts);

  if (tipo === "beneficios") {
    det.hidden = true;
    $("#levels-title").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  let html = "";
  if (tipo === "cupons") {
    html = `<h3>Cupons disponíveis</h3>` + Object.entries(CUPONS).map(([cod, c]) => `
      <div class="cupom-row">
        <div><strong>${cod}</strong><small>${c.descricao}</small></div>
        <button class="pill pill-blue" onclick="cupom='${cod}';localStorage.setItem('paulex_cupom','${cod}');go('carrinho');toast('Cupom ${cod} aplicado!')">Usar</button>
      </div>`).join("");
  } else if (tipo === "cashback") {
    html = `<h3>Cashback</h3>
      <p class="club-text">Seu nível <strong>${lv.nome}</strong> dá <strong>${lv.cashback}% de cashback</strong> em pontos a cada compra confirmada. Subindo de nível, o percentual aumenta — veja a tabela de níveis abaixo.</p>`;
  } else if (tipo === "pontos") {
    const linhas = myOrders.filter((o) => o.status !== "cancelado").map((o) =>
      `<div class="cupom-row"><div><strong>+${Math.floor(o.total)} pts</strong><small>Pedido #${o.numero} · ${o.data}</small></div></div>`
    ).join("");
    html = `<h3>Histórico de pontos</h3>` +
      (linhas || `<p class="club-text">Você ainda não tem movimentações. A cada R$ 1 em pedidos, você ganha 1 ponto.</p>`);
  }
  det.innerHTML = html;
  det.hidden = false;
}

/* ---------- Endereços (reais, salvos no aparelho) ---------- */
let editAddr = -1;

function renderAddrs() {
  $("#addr-empty").hidden = addrs.length > 0;
  $("#addr-list").innerHTML = addrs.map((a, i) => `
    <div class="address">
      <div>
        <strong>${a.nome} ${i === 0 ? '<span class="chip">Principal</span>' : ""}</strong>
        <small>${a.rua}<br>${a.bairro}<br>CEP ${a.cep || "—"}</small>
        ${i > 0 ? `<button class="link addr-main" onclick="mainAddr(${i})">Tornar principal</button>` : ""}
      </div>
      <div class="address-actions">
        <button class="icon-btn" aria-label="Editar" onclick="showAddrForm(${i})">
          <svg viewBox="0 0 24 24"><path d="M5 19l1-4L16 5l3 3L9 18l-4 1z"/></svg>
        </button>
        <button class="icon-btn" aria-label="Excluir" onclick="delAddr(${i})">
          <svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
        </button>
      </div>
    </div>`).join("");
}

function showAddrForm(i = -1) {
  editAddr = i;
  const a = addrs[i] || { nome: "", cep: "", rua: "", bairro: "" };
  $("#addr-nome").value = a.nome;
  $("#addr-cep").value = a.cep;
  $("#addr-rua").value = a.rua;
  $("#addr-bairro").value = a.bairro;
  $("#addr-form").hidden = false;
  $("#addr-nome").focus();
}

function hideAddrForm() {
  $("#addr-form").hidden = true;
  editAddr = -1;
}

function saveAddr(e) {
  e.preventDefault();
  const a = {
    nome: $("#addr-nome").value.trim(),
    cep: $("#addr-cep").value.trim(),
    rua: $("#addr-rua").value.trim(),
    bairro: $("#addr-bairro").value.trim(),
  };
  if (editAddr >= 0) addrs[editAddr] = a;
  else addrs.push(a);
  saveAddrsLS();
  hideAddrForm();
  renderAddrs();
  toast("Endereço salvo!");
}

function delAddr(i) {
  if (!confirm(`Excluir o endereço "${addrs[i].nome}"?`)) return;
  addrs.splice(i, 1);
  saveAddrsLS();
  renderAddrs();
}

function mainAddr(i) {
  addrs.unshift(addrs.splice(i, 1)[0]);
  saveAddrsLS();
  renderAddrs();
  toast("Endereço principal atualizado");
}

/* Busca automática de endereço pelo CEP (ViaCEP) */
function cepLookup() {
  const cep = $("#addr-cep").value.replace(/\D/g, "");
  if (cep.length !== 8) return;
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((r) => r.json())
    .then((d) => {
      if (d.erro) return;
      if (!$("#addr-rua").value) $("#addr-rua").value = d.logradouro || "";
      $("#addr-bairro").value = `${d.bairro ? d.bairro + " · " : ""}${d.localidade}, ${d.uf}`;
    })
    .catch(() => {});
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
  let nome = "", email = "";
  if (!$("#form-cadastrar").hidden) {
    nome = $("#cad-nome").value.trim();
    email = $("#cad-email").value.trim();
  } else {
    const u = $("#login-user").value.trim();
    if (u.includes("@")) { email = u; nome = u.split("@")[0]; }
    else nome = u;
  }
  if (nome || email) {
    localStorage.setItem("paulex_user", JSON.stringify({ nome: nome || email, email }));
  }
  logged = true;
  localStorage.setItem("paulex_logged", "1");
  renderUser();
  toast(nome ? `Bem-vindo, ${nome.split(" ")[0]}!` : "Bem-vindo à Paulex!");
  setRoute("/conta");
}

function logout() {
  logged = false;
  localStorage.removeItem("paulex_logged");
  localStorage.removeItem("paulex_user");
  toast("Você saiu da sua conta");
  renderUser();
  setRoute("/login");
}

/* ---------- Login com Google (Google Identity Services) ----------
   Só é ativado quando GOOGLE_CLIENT_ID está preenchido em produtos.js */
function initGoogle() {
  if (typeof GOOGLE_CLIENT_ID === "undefined" || !GOOGLE_CLIENT_ID) return;
  const s = document.createElement("script");
  s.src = "https://accounts.google.com/gsi/client";
  s.async = true;
  s.defer = true;
  s.onload = () => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onGoogleCredential,
    });
    const slot = $("#google-btn-slot");
    slot.hidden = false;
    $("#or-row").hidden = false;
    google.accounts.id.renderButton(slot, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "signin_with",
      locale: "pt-BR",
      width: 300,
    });
  };
  document.head.appendChild(s);
}

function onGoogleCredential(resp) {
  try {
    // decodifica o payload do JWT (base64url -> UTF-8)
    const b64 = resp.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(b64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const dados = JSON.parse(json);
    localStorage.setItem("paulex_user", JSON.stringify({ nome: dados.name, email: dados.email }));
  } catch (_) { /* segue com login genérico */ }
  logged = true;
  localStorage.setItem("paulex_logged", "1");
  renderUser();
  const u = JSON.parse(localStorage.getItem("paulex_user") || "null");
  toast(u ? `Bem-vindo, ${u.nome.split(" ")[0]}!` : "Bem-vindo à Paulex!");
  setRoute("/conta");
}

function renderUser() {
  const u = JSON.parse(localStorage.getItem("paulex_user") || "null");
  const lv = clubLevel(clubPoints());
  $("#account-name").textContent = u ? `Olá, ${u.nome.split(" ")[0]}!` : "Olá, cliente Paulex!";
  $("#account-sub").textContent =
    (u && u.email ? u.email + " · " : "") + `Paulex Club ${lv.nome}`;
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
renderUser();
initGoogle();
route();

// Aplicativo instalável (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

setTimeout(() => $("#splash").classList.add("hide"), 1800);
