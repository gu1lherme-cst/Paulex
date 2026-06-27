/* =============================================================
   PAULEX ARMARINHO — SCRIPT
   JavaScript puro, sem dependências.
   -------------------------------------------------------------
   Responsabilidades:
   1. Configuração (WhatsApp, catálogo)
   2. Helpers
   3. Render dos produtos em destaque
   4. Carrinho (estado + UI + persistência)
   5. Cabeçalho: scroll, menu mobile, busca
   6. Inicialização
============================================================= */
(function () {
  "use strict";

  /* ============================================================
     1. CONFIGURAÇÃO
     Centralizada para facilitar manutenção e futura migração
     para Shopify (basta substituir CATALOG pela fonte real).
  ============================================================= */
  var CONFIG = {
    // Substitua pelo número real (formato internacional, só dígitos).
    whatsapp: "5521000000000",
    storeName: "Paulex Armarinho",
    storageKey: "paulex.cart.v1"
  };

  // Catálogo de demonstração. `emoji` simula a imagem do produto.
  var CATALOG = [
    { id: "p1", name: "Caderno universitário 200 folhas", cat: "Papelaria", price: 24.9, emoji: "📓" },
    { id: "p2", name: "Caneta esferográfica (cx. 50)", cat: "Papelaria", price: 39.9, emoji: "🖊️" },
    { id: "p3", name: "Kit organizador de mesa", cat: "Utilidades", price: 59.9, emoji: "🗂️" },
    { id: "p4", name: "Carrinho de brinquedo", cat: "Brinquedos", price: 34.9, emoji: "🚗" },
    { id: "p5", name: "Hidratante facial 200ml", cat: "Cosméticos", price: 29.9, emoji: "🧴" },
    { id: "p6", name: "Mouse sem fio", cat: "Informática", price: 49.9, emoji: "🖱️" },
    { id: "p7", name: "Copos descartáveis (pct. 100)", cat: "Descartáveis", price: 12.9, emoji: "🥤" },
    { id: "p8", name: "Massinha de modelar 12 cores", cat: "Brinquedos", price: 19.9, emoji: "🎨" }
  ];

  /* ============================================================
     2. HELPERS
  ============================================================= */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function formatBRL(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function waLink(text) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  }

  /* ============================================================
     3. PRODUTOS EM DESTAQUE
  ============================================================= */
  function renderProducts() {
    var grid = $("[data-product-grid]");
    if (!grid) return;

    var html = CATALOG.map(function (p) {
      return (
        '<li class="product-card">' +
          '<div class="product-card__media" aria-hidden="true">' + p.emoji + "</div>" +
          '<div class="product-card__body">' +
            '<span class="product-card__cat">' + p.cat + "</span>" +
            '<h3 class="product-card__name">' + p.name + "</h3>" +
          "</div>" +
          '<div class="product-card__foot">' +
            '<span class="product-card__price">' + formatBRL(p.price) + "</span>" +
            '<button class="btn btn--primary product-card__add" type="button" ' +
              'data-add="' + p.id + '" aria-label="Adicionar ' + p.name + ' ao carrinho">Adicionar</button>' +
          "</div>" +
        "</li>"
      );
    }).join("");

    grid.innerHTML = html;
  }

  /* ============================================================
     4. CARRINHO
  ============================================================= */
  var Cart = {
    items: {}, // { id: qty }

    load: function () {
      try {
        var raw = localStorage.getItem(CONFIG.storageKey);
        this.items = raw ? JSON.parse(raw) : {};
      } catch (e) {
        this.items = {};
      }
    },

    save: function () {
      try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.items));
      } catch (e) { /* armazenamento indisponível: segue só em memória */ }
    },

    add: function (id) {
      this.items[id] = (this.items[id] || 0) + 1;
      this.save();
      this.render();
    },

    setQty: function (id, qty) {
      if (qty <= 0) { delete this.items[id]; }
      else { this.items[id] = qty; }
      this.save();
      this.render();
    },

    remove: function (id) {
      delete this.items[id];
      this.save();
      this.render();
    },

    count: function () {
      var self = this;
      return Object.keys(this.items).reduce(function (sum, id) {
        return sum + self.items[id];
      }, 0);
    },

    total: function () {
      var self = this;
      return Object.keys(this.items).reduce(function (sum, id) {
        var product = CATALOG.find(function (p) { return p.id === id; });
        return product ? sum + product.price * self.items[id] : sum;
      }, 0);
    },

    // Atualiza toda a UI do carrinho (badge, lista, total, checkout).
    render: function () {
      var count = this.count();
      var badge = $("[data-cart-count]");
      if (badge) {
        badge.textContent = count;
        badge.hidden = count === 0;
      }

      var list = $("[data-cart-items]");
      var empty = $("[data-cart-empty]");
      var ids = Object.keys(this.items);

      if (list) {
        var self = this;
        list.innerHTML = ids.map(function (id) {
          var p = CATALOG.find(function (x) { return x.id === id; });
          if (!p) return "";
          var qty = self.items[id];
          return (
            '<li class="cart-item" data-line="' + id + '">' +
              '<span class="cart-item__media" aria-hidden="true">' + p.emoji + "</span>" +
              "<div>" +
                '<div class="cart-item__name">' + p.name + "</div>" +
                '<div class="cart-item__price">' + formatBRL(p.price) + "</div>" +
                '<div class="cart-item__qty">' +
                  '<button type="button" data-dec="' + id + '" aria-label="Diminuir quantidade">−</button>' +
                  "<span>" + qty + "</span>" +
                  '<button type="button" data-inc="' + id + '" aria-label="Aumentar quantidade">+</button>' +
                "</div>" +
              "</div>" +
              '<button class="cart-item__remove" type="button" data-remove="' + id + '">Remover</button>' +
            "</li>"
          );
        }).join("");
      }

      if (empty) empty.hidden = ids.length > 0;
      if (list) list.hidden = ids.length === 0;

      var totalEl = $("[data-cart-total]");
      if (totalEl) totalEl.textContent = formatBRL(this.total());

      this.updateCheckout();
    },

    // Monta a mensagem de WhatsApp com o resumo do pedido.
    updateCheckout: function () {
      var link = $("[data-cart-checkout]");
      if (!link) return;

      var ids = Object.keys(this.items);
      if (ids.length === 0) {
        link.href = waLink("Olá! Gostaria de fazer um pedido na " + CONFIG.storeName + ".");
        return;
      }

      var self = this;
      var lines = ids.map(function (id) {
        var p = CATALOG.find(function (x) { return x.id === id; });
        return "• " + self.items[id] + "x " + p.name + " — " + formatBRL(p.price * self.items[id]);
      });
      var msg =
        "Olá! Quero finalizar este pedido na " + CONFIG.storeName + ":\n" +
        lines.join("\n") +
        "\n\nTotal: " + formatBRL(this.total());

      link.href = waLink(msg);
    }
  };

  /* ============================================================
     5. UI: overlays, menu, busca, scroll
  ============================================================= */
  var body = document.body;
  var lastFocused = null; // elemento que tinha foco antes de abrir um overlay

  function lockScroll(lock) {
    body.classList.toggle("is-locked", lock);
  }

  // Move o foco para um elemento, guardando o foco anterior para restaurar depois.
  function captureFocus(target) {
    lastFocused = document.activeElement;
    if (target) target.focus();
  }
  function restoreFocus() {
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    lastFocused = null;
  }

  // ----- Carrinho (drawer) -----
  function openCart() {
    var cart = $("#cart");
    var overlay = $("[data-cart-overlay]");
    if (!cart) return;
    cart.classList.add("is-open");
    cart.setAttribute("aria-hidden", "false");
    if (overlay) overlay.hidden = false;
    lockScroll(true);
    captureFocus($("[data-action='cart-close']", cart));
  }
  function closeCart() {
    var cart = $("#cart");
    var overlay = $("[data-cart-overlay]");
    if (!cart || !cart.classList.contains("is-open")) return;
    cart.classList.remove("is-open");
    cart.setAttribute("aria-hidden", "true");
    if (overlay) overlay.hidden = true;
    lockScroll(false);
    restoreFocus();
  }

  // ----- Menu mobile -----
  function setMenu(open) {
    var nav = $("#primary-nav");
    var toggle = $(".nav-toggle");
    var overlay = $("[data-nav-overlay]");
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (overlay) overlay.hidden = !open;
    lockScroll(open);
  }

  // ----- Busca -----
  function setSearch(open) {
    var bar = $("#searchbar");
    if (!bar) return;
    bar.hidden = !open;
    if (open) {
      var input = $(".searchbar__input", bar);
      if (input) input.focus();
    }
  }

  /* ============================================================
     6. EVENTOS
  ============================================================= */
  function bindEvents() {
    // Delegação global de cliques.
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-action], [data-add], [data-inc], [data-dec], [data-remove]");
      if (!t) return;

      // Ações nomeadas (header, overlays)
      var action = t.getAttribute("data-action");
      switch (action) {
        case "cart": openCart(); return;
        case "cart-close": closeCart(); return;
        case "menu": setMenu(!$("#primary-nav").classList.contains("is-open")); return;
        case "search": setSearch(true); return;
        case "search-close": setSearch(false); return;
        case "account":
          window.open(waLink("Olá! Preciso de ajuda com minha conta na " + CONFIG.storeName + "."), "_blank");
          return;
      }

      // Adicionar produto
      var addId = t.getAttribute("data-add");
      if (addId) {
        Cart.add(addId);
        t.classList.add("is-added");
        var original = t.textContent;
        t.textContent = "Adicionado ✓";
        setTimeout(function () {
          t.classList.remove("is-added");
          t.textContent = original;
        }, 1100);
        return;
      }

      // Controles do carrinho
      var inc = t.getAttribute("data-inc");
      if (inc) { Cart.setQty(inc, (Cart.items[inc] || 0) + 1); return; }

      var dec = t.getAttribute("data-dec");
      if (dec) { Cart.setQty(dec, (Cart.items[dec] || 0) - 1); return; }

      var rem = t.getAttribute("data-remove");
      if (rem) { Cart.remove(rem); return; }
    });

    // Overlays fecham seus respectivos painéis
    var cartOverlay = $("[data-cart-overlay]");
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
    var navOverlay = $("[data-nav-overlay]");
    if (navOverlay) navOverlay.addEventListener("click", function () { setMenu(false); });

    // Fecha o menu mobile ao clicar num link da navegação
    var nav = $("#primary-nav");
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.closest(".nav__link")) setMenu(false);
      });
    }

    // ESC fecha overlays
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeCart();
        setMenu(false);
        setSearch(false);
      }
    });

    // Busca: redireciona ao WhatsApp com o termo (placeholder até backend real)
    var form = $("[data-search-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = $(".searchbar__input", form).value.trim();
        var msg = q
          ? 'Olá! Estou procurando por "' + q + '". Vocês têm?'
          : "Olá! Gostaria de tirar uma dúvida sobre os produtos.";
        window.open(waLink(msg), "_blank");
      });
    }

    // Sombra do header ao rolar
    var header = $("#header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ============================================================
     7. INICIALIZAÇÃO
  ============================================================= */
  function init() {
    // Ano dinâmico no rodapé
    var yearEl = $("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    renderProducts();
    Cart.load();
    Cart.render();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
