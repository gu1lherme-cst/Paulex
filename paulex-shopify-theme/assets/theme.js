/* ==========================================================================
   Paulex Advanced — theme.js
   Vanilla JS, modular custom elements. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  const Settings = window.PaulexSettings || {};
  const Routes = Settings.routes || {};
  const Strings = Settings.strings || {};

  /* ---------- Utilities -------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const formatMoney = (cents) => {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: window.Shopify && Shopify.currency ? Shopify.currency.active : 'BRL' }).format(cents / 100);
    } catch (e) {
      return 'R$ ' + (cents / 100).toFixed(2).replace('.', ',');
    }
  };

  const debounce = (fn, wait) => {
    let t;
    return function () {
      const ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), wait);
    };
  };

  // Escapa texto antes de inserir como HTML. Mesmo vindo da loja, dados de
  // produto/coleção passam por aqui para evitar qualquer injeção.
  const escapeHTML = (value) => String(value == null ? '' : value).replace(/[&<>'"]/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));

  // Escapa um valor para uso seguro dentro de um atributo (ex.: href).
  const escapeAttr = (value) => encodeURI(String(value == null ? '' : value)).replace(/"/g, '%22');

  // Só aceita caminhos relativos ou http(s); bloqueia javascript:/data:/etc.
  // Defesa em profundidade caso a fonte da URL mude (metafield/app de terceiro).
  const safeUrl = (value) => {
    const s = String(value == null ? '' : value).trim();
    if (/^\//.test(s) || /^https?:\/\//i.test(s)) return s;
    return '#';
  };

  const trapFocus = (container) => {
    const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container);
    if (!focusable.length) return () => {};
    const first = focusable[0], last = focusable[focusable.length - 1];
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  };

  /* ---------- Toast notifications --------------------------------------- */
  const Toast = {
    show(message, type) {
      const region = $('#px-toast-region');
      if (!region) return;
      const el = document.createElement('div');
      el.className = 'px-toast' + (type ? ' px-toast--' + type : '');
      el.setAttribute('role', 'status');
      el.textContent = message;
      region.appendChild(el);
      requestAnimationFrame(() => el.classList.add('is-visible'));
      setTimeout(() => {
        el.classList.remove('is-visible');
        setTimeout(() => el.remove(), 350);
      }, 3200);
    }
  };

  /* ---------- Cart API + global store ----------------------------------- */
  const Cart = {
    subscribers: [],
    subscribe(fn) { this.subscribers.push(fn); },
    publish(state) { this.subscribers.forEach((fn) => fn(state)); },

    async add(formData) {
      const res = await fetch(Routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.description || Strings.addToCartError);
      }
      await this.refresh();
      return res.json();
    },

    // Adiciona vários itens de uma vez (usado pelo pedido rápido B2B).
    async addItems(items) {
      const res = await fetch(Routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.description || Strings.addToCartError);
      }
      await this.refresh();
      return res.json();
    },

    async change(key, quantity) {
      const res = await fetch(Routes.cart_change_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      const data = await res.json();
      await this.refresh();
      return data;
    },

    async refresh() {
      const res = await fetch(Routes.cart_url + '.js', { headers: { 'Accept': 'application/json' } });
      const cart = await res.json();
      this.updateCount(cart.item_count);
      await this.refreshHTML();
      this.publish(cart);
      return cart;
    },

    async refreshHTML() {
      // Re-render the drawer/page body from the cart route HTML.
      try {
        const res = await fetch(Routes.cart_url, { headers: { 'Accept': 'text/html' } });
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const fresh = doc.querySelector('[data-cart-root]');
        $$('[data-cart-body]').forEach((body) => {
          if (fresh) body.innerHTML = fresh.outerHTML;
        });
      } catch (e) { /* noop */ }
    },

    updateCount(count) {
      $$('[data-cart-count]').forEach((el) => {
        el.textContent = count;
        el.classList.toggle('is-empty', count === 0);
      });
    }
  };

  const saveCartNote = debounce(function (value) {
    fetch(Routes.cart_update_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: value })
    });
  }, 600);

  function getCartLineQuantity(key) {
    const row = document.querySelector('.px-cart-item[data-key="' + key + '"]');
    const input = row && row.querySelector('[data-qty-input]');
    return input ? parseInt(input.value, 10) || 0 : 0;
  }

  function markCartLineUpdating(key) {
    const row = document.querySelector('.px-cart-item[data-key="' + key + '"]');
    if (row) row.classList.add('is-updating');
  }

  async function setCartLineQuantity(key, quantity) {
    if (!key) return;
    markCartLineUpdating(key);
    try {
      await Cart.change(key, Math.max(0, quantity));
    } catch (e) {
      Toast.show(Strings.quantityError || 'Erro', 'error');
    }
  }

  function initGlobalCartControls() {
    document.addEventListener('click', (e) => {
      const up = e.target.closest('[data-qty-up]');
      const down = e.target.closest('[data-qty-down]');
      const remove = e.target.closest('[data-qty-remove]');
      const qtyButton = up || down || remove;

      if (qtyButton && qtyButton.dataset.key) {
        e.preventDefault();
        const key = qtyButton.dataset.key;
        if (remove) return setCartLineQuantity(key, 0);
        const current = getCartLineQuantity(key) || 1;
        return setCartLineQuantity(key, current + (up ? 1 : -1));
      }

      const couponButton = e.target.closest('[data-coupon-apply]');
      if (couponButton && !couponButton.closest('cart-drawer')) {
        e.preventDefault();
        const root = couponButton.closest('[data-cart-root]') || document;
        const input = root.querySelector('[data-coupon-input]');
        if (input && input.value) {
          window.location.href = Routes.cart_url + '?discount=' + encodeURIComponent(input.value.trim());
        }
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-qty-input]') && e.target.dataset.key) {
        setCartLineQuantity(e.target.dataset.key, parseInt(e.target.value, 10) || 0);
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.matches('[data-cart-note]') && !e.target.closest('cart-drawer')) {
        saveCartNote(e.target.value);
      }
    });
  }

  /* ---------- Sticky header --------------------------------------------- */
  class StickyHeader extends HTMLElement {
    connectedCallback() {
      this.lastScroll = 0;
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    }
    disconnectedCallback() { window.removeEventListener('scroll', this.onScroll); }
    onScroll() {
      const y = window.scrollY;
      this.classList.toggle('is-scrolled', y > 20);
      this.lastScroll = y;
    }
  }
  customElements.define('sticky-header', StickyHeader);

  /* ---------- Generic drawer controller (open/close + focus) ------------ */
  function bindDrawer(el, { openSelectors, closeSelectors, onOpen, onClose }) {
    if (!el) return null;
    let releaseFocus = null, lastFocused = null;
    const open = () => {
      lastFocused = document.activeElement;
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('px-no-scroll');
      releaseFocus = trapFocus(el);
      const focusTarget = el.querySelector('input, button, [tabindex]');
      if (focusTarget) setTimeout(() => focusTarget.focus(), 60);
      if (onOpen) onOpen();
    };
    const close = () => {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('px-no-scroll');
      if (releaseFocus) releaseFocus();
      if (lastFocused) lastFocused.focus();
      if (onClose) onClose();
    };
    (openSelectors || []).forEach((sel) => $$(sel).forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); open(); })));
    (closeSelectors || []).forEach((sel) => $$(sel, el).forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); close(); })));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.classList.contains('is-open')) close(); });
    return { open, close };
  }

  /* ---------- Cart drawer ----------------------------------------------- */
  class CartDrawer extends HTMLElement {
    connectedCallback() {
      this.controller = bindDrawer(this, {
        closeSelectors: ['[data-drawer-close]']
      });
      // Open from header cart button when in drawer mode.
      if (Settings.cartType === 'drawer') {
        $$('[data-cart-toggle]').forEach((btn) => btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.controller.open();
        }));
      }
      this.bindExtras();
    }

    open() { this.controller && this.controller.open(); }

    bindExtras() {
      // Quantidade/remover dos itens são tratados pela delegação global
      // (initGlobalCartControls) via [data-key]. Aqui só nota e cupom do drawer.
      this.addEventListener('input', (e) => {
        if (e.target.matches('[data-cart-note]')) {
          saveCartNote(e.target.value);
        }
      });
      this.addEventListener('click', (e) => {
        if (e.target.closest('[data-coupon-apply]')) {
          const input = $('[data-coupon-input]', this);
          if (input && input.value) {
            window.location.href = Routes.cart_url + '?discount=' + encodeURIComponent(input.value.trim());
          }
        }
      });
    }

  }
  customElements.define('cart-drawer', CartDrawer);

  /* ---------- Mobile nav ------------------------------------------------- */
  function initMobileNav() {
    const nav = $('[data-mobile-nav]');
    if (!nav) return;
    bindDrawer(nav, {
      openSelectors: ['[data-mobile-open]'],
      closeSelectors: ['[data-mobile-close]']
    });
  }

  /* ---------- Search modal + predictive search -------------------------- */
  class SearchModal extends HTMLElement {
    connectedCallback() {
      this.controller = bindDrawer(this, {
        openSelectors: ['[data-search-open]'],
        closeSelectors: ['[data-search-close]']
      });
      this.input = $('[data-predictive-search-input]', this);
      this.results = $('[data-predictive-search-results]', this);
      this.activeIndex = -1;
      this.items = [];
      if (this.input) {
        this.input.addEventListener('input', debounce(() => this.search(), 250));
        this.input.setAttribute('role', 'combobox');
        this.input.setAttribute('aria-expanded', 'false');
        this.input.setAttribute('aria-autocomplete', 'list');
        this.input.addEventListener('keydown', (e) => this.onKeydown(e));
      }
    }

    async search() {
      const q = this.input.value.trim();
      this.activeIndex = -1;
      if (q.length < 2) { this.results.innerHTML = ''; this.input.setAttribute('aria-expanded', 'false'); return; }
      // Estado de carregando (acessível via aria-live no container).
      this.results.innerHTML = '<div class="px-predictive__loading" role="status">' + (Strings.searching || 'Buscando…') + '</div>';
      try {
        const url = (Routes.predictive_search_url || '/search/suggest') +
          '.json?q=' + encodeURIComponent(q) +
          '&resources[type]=product,collection,page&resources[limit]=6&resources[options][unavailable_products]=last';
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const data = await res.json();
        this.render(data.resources.results, q);
      } catch (e) {
        this.results.innerHTML = '<div class="px-predictive__empty">' + (Strings.searchError || 'Não foi possível buscar agora.') + '</div>';
      }
    }

    render(results, q) {
      const products = results.products || [];
      const collections = results.collections || [];
      const pages = results.pages || [];
      let html = '';

      if (!products.length && !collections.length && !pages.length) {
        this.results.innerHTML = '<div class="px-predictive__empty">' + escapeHTML(Strings.noResults || 'Nenhum resultado.') + '</div>';
        this.input.setAttribute('aria-expanded', 'false');
        return;
      }

      if (products.length) {
        html += '<div class="px-predictive__group"><p class="px-predictive__heading">' + escapeHTML(Strings.products || 'Produtos') + '</p>';
        products.forEach((p) => {
          const img = p.featured_image && p.featured_image.url ? p.featured_image.url : (p.image || '');
          const imgUrl = img ? (img + (img.indexOf('?') > -1 ? '&' : '?') + 'width=120') : '';
          html += '<a class="px-predictive__product" href="' + escapeAttr(safeUrl(p.url)) + '" role="option">' +
            (img ? '<img src="' + escapeAttr(safeUrl(imgUrl)) + '" alt="" loading="lazy">' : '') +
            '<span><span class="px-predictive__product-title">' + escapeHTML(p.title) + '</span><br>' +
            '<span class="px-predictive__product-price">' + (p.price ? formatMoney(parseFloat(p.price) * 100) : '') + '</span></span></a>';
        });
        html += '</div>';
      }

      if (collections.length) {
        html += '<div class="px-predictive__group"><p class="px-predictive__heading">' + escapeHTML(Strings.collections || 'Categorias') + '</p><div class="px-predictive__links">';
        collections.forEach((c) => { html += '<a href="' + escapeAttr(safeUrl(c.url)) + '" role="option">' + escapeHTML(c.title) + '</a>'; });
        html += '</div></div>';
      }

      if (pages.length) {
        html += '<div class="px-predictive__group"><p class="px-predictive__heading">' + escapeHTML(Strings.pages || 'Páginas') + '</p><div class="px-predictive__links">';
        pages.forEach((c) => { html += '<a href="' + escapeAttr(safeUrl(c.url)) + '" role="option">' + escapeHTML(c.title) + '</a>'; });
        html += '</div></div>';
      }

      html += '<a class="px-predictive__all" href="/search?q=' + encodeURIComponent(q) + '" role="option">' + escapeHTML(Strings.viewAll || 'Ver todos os resultados') + ' &rarr;</a>';
      this.results.innerHTML = html;
      this.items = $$('a[role="option"]', this.results);
      this.input.setAttribute('aria-expanded', 'true');
    }

    onKeydown(e) {
      if (!this.items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.setActive((this.activeIndex + 1) % this.items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.setActive((this.activeIndex - 1 + this.items.length) % this.items.length);
      } else if (e.key === 'Enter') {
        if (this.activeIndex > -1 && this.items[this.activeIndex]) {
          e.preventDefault();
          window.location.href = this.items[this.activeIndex].href;
        }
      }
    }

    setActive(index) {
      this.items.forEach((el) => el.classList.remove('is-active'));
      this.activeIndex = index;
      const el = this.items[index];
      if (el) {
        el.classList.add('is-active');
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }
  customElements.define('search-modal', SearchModal);

  /* ---------- Product form (AJAX add + variant switching) --------------- */
  class ProductForm extends HTMLElement {
    connectedCallback() {
      this.form = $('form[action*="/cart/add"]', this) || $('.px-product__add-form', this);
      this.variantInput = $('[data-variant-id]', this);
      this.variants = this.parseVariants();
      this.productRoot = this.closest('.px-product') || document;
      this.priceBlock = $('[data-price-block]', this.productRoot);
      this.skuEl = $('[data-product-sku]', this.productRoot);

      if (this.form) this.form.addEventListener('submit', (e) => this.onSubmit(e));
      $$('[data-variant-option]', this).forEach((input) => input.addEventListener('change', () => this.onVariantChange()));
      this.initQty();
      // Estado inicial das pills (esgotado/indisponível) no carregamento.
      this.updatePillStates();
    }

    /* Para cada valor de cada opção, marca como esgotado quando não existe
       variante disponível compatível com as opções já escolhidas à esquerda. */
    updatePillStates() {
      if (!this.variants.length) return;
      const groups = $$('[data-option-index]', this);
      const selected = groups.map((g) => {
        const c = $('[data-variant-option]:checked', g);
        return c ? c.value : null;
      });
      groups.forEach((group, i) => {
        $$('.px-variant__pill', group).forEach((pill) => {
          const input = $('[data-variant-option]', pill);
          if (!input) return;
          const value = input.value;
          const exists = this.variants.some((v) =>
            v.options[i] === value &&
            selected.slice(0, i).every((opt, j) => opt == null || v.options[j] === opt)
          );
          const available = this.variants.some((v) =>
            v.options[i] === value && v.available &&
            selected.slice(0, i).every((opt, j) => opt == null || v.options[j] === opt)
          );
          pill.classList.toggle('is-soldout', exists && !available);
          pill.classList.toggle('is-unavailable', !exists);
        });
      });
    }

    parseVariants() {
      const json = $('[data-variant-json]', this);
      if (!json) return [];
      try { return JSON.parse(json.textContent); } catch (e) { return []; }
    }

    initQty() {
      $$('[data-qty]', this).forEach((wrap) => {
        const input = $('[data-qty-input]', wrap);
        if (!input) return;
        // Respeita step/min (pedido mínimo e múltiplos de atacado via metafield).
        const step = parseInt(input.step, 10) || 1;
        const min = parseInt(input.min, 10) || 1;
        $('[data-qty-up]', wrap).addEventListener('click', () => { input.value = (parseInt(input.value, 10) || 0) + step; });
        $('[data-qty-down]', wrap).addEventListener('click', () => { input.value = Math.max(min, (parseInt(input.value, 10) || min) - step); });
      });
    }

    onVariantChange() {
      // Se o JSON de variantes não pôde ser lido, não mexemos no botão:
      // mantemos o estado renderizado no servidor (evita produto não-comprável).
      if (!this.variants.length) return;
      const selected = $$('[data-option-index]', this).map((group) => {
        const checked = $('[data-variant-option]:checked', group);
        // sync pill visual state
        $$('.px-variant__pill', group).forEach((p) => p.classList.remove('is-selected'));
        if (checked) checked.closest('.px-variant__pill').classList.add('is-selected');
        return checked ? checked.value : null;
      });

      this.updatePillStates();

      const match = this.variants.find((v) => selected.every((opt, i) => v.options[i] === opt));
      const btn = $('[data-add-to-cart]', this);
      const btnText = $('[data-add-text]', this);

      if (match) {
        this.variantInput.value = match.id;
        // Update URL for shareability without reload
        if (history.replaceState) {
          const url = new URL(window.location);
          url.searchParams.set('variant', match.id);
          history.replaceState({}, '', url);
        }
        if (this.priceBlock) {
          this.priceBlock.innerHTML = this.renderPrice(match);
        }
        if (match.featured_media && match.featured_media.id) {
          const gallery = $('[data-product-gallery]');
          if (gallery && typeof gallery.activate === 'function') {
            gallery.activate(String(match.featured_media.id));
          }
        }
        this.updateSku(match);
        if (btn) {
          btn.disabled = !match.available;
          if (btnText) btnText.textContent = match.available ? (Strings.addToCart || 'Adicionar ao carrinho') : (Strings.soldOut || 'Esgotado');
        }
        // Avisa stock-status e barra fixa sobre a variante atual.
        this.dispatchEvent(new CustomEvent('variant:change', {
          bubbles: true,
          detail: { variant: match, available: match.available }
        }));
      } else {
        // Combinação inexistente: botão desabilitado e texto "Indisponível".
        if (btn) {
          btn.disabled = true;
          if (btnText) btnText.textContent = Strings.unavailable || 'Indisponível';
        }
        this.dispatchEvent(new CustomEvent('variant:change', {
          bubbles: true,
          detail: { variant: null, available: false }
        }));
      }
    }

    updateSku(variant) {
      if (!this.skuEl) return;
      this.skuEl.textContent = variant.sku || '';
      const wrap = this.skuEl.closest('.px-product__sku');
      if (wrap) wrap.classList.toggle('is-empty', !variant.sku);
    }

    renderPrice(variant) {
      let html = '<div class="px-price' + (variant.compare_at_price > variant.price ? ' px-price--on-sale' : '') + '">';
      html += '<span class="px-price__current">' + formatMoney(variant.price) + '</span>';
      if (variant.compare_at_price > variant.price) {
        html += '<s class="px-price__compare">' + formatMoney(variant.compare_at_price) + '</s>';
      }
      html += '<span class="px-price__installments">ou 12x de ' + formatMoney(Math.round(variant.price / 12)) + ' sem juros</span>';
      html += '</div>';
      return html;
    }

    async onSubmit(e) {
      e.preventDefault();
      const btn = $('[data-add-to-cart]', this) || $('[data-quick-add]', this);
      const original = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.classList.add('is-loading'); btn.innerHTML = '<span>...</span>'; }
      try {
        await Cart.add(new FormData(this.form));
        Toast.show(Strings.addedToCart || 'Adicionado ao carrinho', 'success');
        const drawer = $('#CartDrawer');
        if (Settings.cartType === 'drawer' && drawer && drawer.open) drawer.open();
      } catch (err) {
        Toast.show(err.message || Strings.addToCartError, 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); btn.innerHTML = original; }
      }
    }
  }
  customElements.define('product-form', ProductForm);

  /* ---------- Stock status (atualiza ao trocar de variante) ------------- */
  class ProductStock extends HTMLElement {
    connectedCallback() {
      this.threshold = parseInt(this.dataset.threshold, 10) || 0;
      this.label = $('[data-stock-label]', this);
      try { this.data = JSON.parse($('[data-stock-json]', this).textContent); }
      catch (e) { this.data = {}; }
      this.render(this.dataset.current);
      const root = this.closest('.px-product') || document;
      root.addEventListener('variant:change', (e) => {
        if (e.detail && e.detail.variant) this.render(String(e.detail.variant.id));
        else this.setState('out', Strings.unavailable || 'Indisponível');
      });
    }
    setState(state, text) {
      this.classList.remove('px-stock--in', 'px-stock--low', 'px-stock--out');
      this.classList.add('px-stock--' + state);
      if (this.label) this.label.textContent = text;
    }
    render(id) {
      const info = this.data[id];
      if (!info || !info.available) {
        this.setState('out', Strings.outOfStock || 'Sem estoque');
        return;
      }
      // `low` é pré-calculado no servidor (não expomos a quantidade exata).
      if (info.low) {
        this.setState('low', Strings.lowStock || 'Últimas unidades');
        return;
      }
      this.setState('in', Strings.inStock || 'Em estoque');
    }
  }
  customElements.define('product-stock', ProductStock);

  /* ---------- Sticky add-to-cart (mobile + desktop) --------------------- */
  class StickyAddToCart extends HTMLElement {
    connectedCallback() {
      this.priceEl = $('[data-sticky-price]', this);
      this.btn = $('[data-sticky-add]', this);
      this.btnText = $('[data-sticky-add-text]', this);
      const root = this.closest('.px-product') || document;
      this.mainBtn = $('[data-add-to-cart]', root);

      // Botão da barra dispara o botão principal (mantém a variante selecionada).
      if (this.btn && this.mainBtn) {
        this.btn.addEventListener('click', () => { if (!this.mainBtn.disabled) this.mainBtn.click(); });
      }
      // Mostra a barra só quando o botão principal sai por cima da viewport.
      if (this.mainBtn && 'IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          const e = entries[0];
          this.toggle(!e.isIntersecting && e.boundingClientRect.top < 0);
        }, { threshold: 0 });
        this.observer.observe(this.mainBtn);
      }
      root.addEventListener('variant:change', (e) => this.onVariant(e.detail));
    }
    toggle(show) {
      this.classList.toggle('is-visible', show);
      this.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) { this.removeAttribute('inert'); } else { this.setAttribute('inert', ''); }
      document.body.classList.toggle('px-has-sticky-atc', show);
    }
    onVariant(detail) {
      if (!detail) return;
      if (detail.variant) {
        if (this.priceEl) this.priceEl.textContent = formatMoney(detail.variant.price);
        if (this.btn) this.btn.disabled = !detail.available;
        if (this.btnText) this.btnText.textContent = detail.available ? (Strings.addToCart || 'Adicionar ao carrinho') : (Strings.soldOut || 'Esgotado');
      } else {
        if (this.btn) this.btn.disabled = true;
        if (this.btnText) this.btnText.textContent = Strings.unavailable || 'Indisponível';
      }
    }
    disconnectedCallback() {
      if (this.observer) this.observer.disconnect();
      document.body.classList.remove('px-has-sticky-atc');
    }
  }
  customElements.define('sticky-add-to-cart', StickyAddToCart);

  /* ---------- Product gallery ------------------------------------------- */
  class ProductGallery extends HTMLElement {
    connectedCallback() {
      this.slides = $$('[data-gallery-slide]', this);
      this.thumbs = $$('[data-gallery-thumb]', this);
      this.thumbs.forEach((thumb) => thumb.addEventListener('click', () => this.activate(thumb.dataset.target)));
      this.initZoom();
    }
    activate(id) {
      this.slides.forEach((s) => s.classList.toggle('is-active', s.dataset.mediaId === id));
      this.thumbs.forEach((t) => {
        const on = t.dataset.target === id;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }
    initZoom() {
      const lightbox = $('[data-zoom-lightbox]', this);
      const lightImg = $('[data-zoom-image]', this);
      if (!lightbox) return;
      $$('[data-zoom-trigger]', this).forEach((btn) => btn.addEventListener('click', () => {
        const img = btn.parentElement.querySelector('img');
        const src = img ? (img.getAttribute('data-zoom-src') || img.currentSrc || img.src) : '';
        lightImg.src = src;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('px-no-scroll');
      }));
      const close = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('px-no-scroll');
      };
      $('[data-zoom-close]', this).addEventListener('click', close);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }
  }
  customElements.define('product-gallery', ProductGallery);

  /* ---------- Shipping (CEP) calculator --------------------------------- */
  class ShippingCalculator extends HTMLElement {
    connectedCallback() {
      this.input = $('[data-cep-input]', this);
      this.result = $('[data-cep-result]', this);
      const btn = $('[data-cep-submit]', this);
      if (btn) btn.addEventListener('click', () => this.calculate());
      if (this.input) {
        this.input.addEventListener('input', () => {
          let v = this.input.value.replace(/\D/g, '').slice(0, 8);
          if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
          this.input.value = v;
        });
        this.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.calculate(); } });
      }
    }
    str(key, fallback) {
      return this.dataset[key] || fallback;
    }
    async calculate() {
      const d = this.dataset;
      const cep = (this.input.value || '').replace(/\D/g, '');
      if (cep.length !== 8) {
        this.result.innerHTML = '<p class="px-shipping__error">' + this.str('strInvalid', 'CEP inválido.') + '</p>';
        return;
      }
      this.result.innerHTML = '<p>' + this.str('strLoading', 'Calculando…') + '</p>';
      try {
        // ViaCEP só valida o endereço (cidade/UF). NÃO é o frete real:
        // os prazos são estimativas; valor e prazo finais saem no checkout.
        const res = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
        const data = await res.json();
        if (data.erro) throw new Error('CEP não encontrado');
        const local = [data.localidade, data.uf].filter(Boolean).join(' - ');
        let html =
          '<p class="px-shipping__local">' + escapeHTML(local) + '</p>' +
          '<p class="px-shipping__estimate">' + this.str('strEstimate', 'Estimativa informativa — entregamos para todo o Brasil.') + '</p>' +
          '<div class="px-shipping__option"><span>' + this.str('strEconomic', 'Econômico') + '</span><span>' + this.str('strEconomicEta', '5–9 dias úteis') + '</span></div>' +
          '<div class="px-shipping__option"><span>' + this.str('strExpress', 'Expresso') + '</span><span>' + this.str('strExpressEta', '2–4 dias úteis') + '</span></div>';
        if (d.pickup) {
          html += '<div class="px-shipping__option px-shipping__option--pickup"><span>' + escapeHTML(d.pickup) + '</span><span>R$ 0,00</span></div>';
        }
        html += '<p class="px-shipping__checkout">' + this.str('strCheckout', 'Valor e prazo finais são calculados no checkout.') + '</p>';
        this.result.innerHTML = html;
      } catch (e) {
        this.result.innerHTML = '<p class="px-shipping__error">' + this.str('strFail', 'Não foi possível calcular. Verifique o CEP.') + '</p>';
      }
    }
  }
  customElements.define('shipping-calculator', ShippingCalculator);

  /* ---------- Order pad (pedido rápido B2B) ----------------------------- */
  class OrderPad extends HTMLElement {
    connectedCallback() {
      this.rows = $$('[data-pad-row]', this);
      this.totalEl = $('[data-pad-total]', this);
      this.countEl = $('[data-pad-count]', this);
      this.addBtn = $('[data-pad-add]', this);
      this.quoteBtn = $('[data-pad-quote]', this);

      this.rows.forEach((row) => {
        const input = $('[data-pad-qty]', row);
        if (input) input.addEventListener('input', () => this.recalc());
        $$('[data-pad-step]', row).forEach((btn) => btn.addEventListener('click', () => {
          if (!input) return;
          const step = parseInt(input.step, 10) || 1;
          const delta = (parseInt(btn.dataset.padStep, 10) || 0) * step;
          input.value = Math.max(0, (parseInt(input.value, 10) || 0) + delta);
          this.recalc();
        }));
      });
      if (this.addBtn) this.addBtn.addEventListener('click', () => this.addAll());
      if (this.quoteBtn) this.quoteBtn.addEventListener('click', () => this.quote());
      this.recalc();
    }

    collect() {
      return this.rows.map((row) => {
        const input = $('[data-pad-qty]', row);
        return {
          id: row.dataset.variantId,
          price: parseInt(row.dataset.price, 10) || 0,
          title: row.dataset.title || '',
          qty: parseInt(input && input.value, 10) || 0
        };
      }).filter((r) => r.qty > 0 && r.id);
    }

    recalc() {
      let total = 0, count = 0;
      this.rows.forEach((row) => {
        const input = $('[data-pad-qty]', row);
        const qty = parseInt(input && input.value, 10) || 0;
        const price = parseInt(row.dataset.price, 10) || 0;
        const lineEl = $('[data-pad-line]', row);
        if (lineEl) lineEl.textContent = qty > 0 ? formatMoney(price * qty) : '—';
        total += price * qty;
        count += qty;
      });
      if (this.totalEl) this.totalEl.textContent = formatMoney(total);
      if (this.countEl) this.countEl.textContent = count;
      const has = count > 0;
      if (this.addBtn) this.addBtn.disabled = !has;
      if (this.quoteBtn) this.quoteBtn.disabled = !has;
    }

    async addAll() {
      const items = this.collect().map((r) => ({ id: r.id, quantity: r.qty }));
      if (!items.length) return;
      this.addBtn.disabled = true;
      this.addBtn.classList.add('is-loading');
      try {
        await Cart.addItems(items);
        Toast.show(Strings.addedToCart || 'Adicionado ao carrinho', 'success');
        const drawer = $('#CartDrawer');
        if (Settings.cartType === 'drawer' && drawer && drawer.open) drawer.open();
      } catch (e) {
        Toast.show(e.message || Strings.addToCartError, 'error');
      } finally {
        this.addBtn.classList.remove('is-loading');
        this.recalc();
      }
    }

    quote() {
      const wa = this.dataset.wa;
      if (!wa) return;
      const lines = this.collect().map((r) => '• ' + r.qty + 'x ' + r.title).join('\n');
      const intro = this.dataset.quoteIntro || 'Olá! Gostaria de um orçamento de atacado:';
      window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(intro + '\n' + lines), '_blank', 'noopener');
    }
  }
  customElements.define('order-pad', OrderPad);

  /* ---------- Collection: facets + sort (AJAX) -------------------------- */
  function initCollection() {
    const grid = $('[data-product-grid]');
    const facetsForm = $('[data-facets-form]');
    const sortSelect = $('[data-sort-select]');
    if (!grid && !sortSelect) return;

    // push=true em interações do usuário (empilha histórico). No popstate
    // (voltar/avançar) usamos push=false para não quebrar o botão Voltar.
    const applyUrl = async (url, push) => {
      if (push === undefined) push = true;
      const results = $('.px-collection__results');
      if (results) results.classList.add('is-loading');
      try {
        const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const freshResults = doc.querySelector('.px-collection__results');
        const freshFacets = doc.querySelector('[data-facets-form]');
        const cur = $('.px-collection__results');
        if (freshResults && cur) cur.innerHTML = freshResults.innerHTML;
        if (freshFacets && facetsForm) facetsForm.innerHTML = freshFacets.innerHTML;
        // Atualiza a contagem de produtos da toolbar.
        const freshCount = doc.querySelector('[data-collection-count]');
        const curCount = $('[data-collection-count]');
        if (freshCount && curCount) curCount.innerHTML = freshCount.innerHTML;
        if (push) history.pushState({}, '', url);
        const toolbar = $('.px-collection__toolbar');
        if (toolbar) window.scrollTo({ top: toolbar.offsetTop - 100, behavior: 'smooth' });
        bindFacetInputs();
      } catch (e) { window.location.href = url; }
      finally { if (results) results.classList.remove('is-loading'); }
    };

    const buildUrl = () => {
      const params = new URLSearchParams(new FormData(facetsForm));
      // strip empties
      const clean = new URLSearchParams();
      params.forEach((v, k) => { if (v) clean.append(k, v); });
      if (sortSelect && sortSelect.value) clean.set('sort_by', sortSelect.value);
      return window.location.pathname + (clean.toString() ? '?' + clean.toString() : '');
    };

    const bindFacetInputs = () => {
      $$('[data-facet-input]').forEach((input) => {
        input.onchange = () => applyUrl(buildUrl());
      });
      const clear = $('[data-facets-clear]');
      if (clear) clear.onclick = (e) => { e.preventDefault(); applyUrl(window.location.pathname); };
    };

    if (sortSelect) sortSelect.addEventListener('change', () => applyUrl(buildUrl()));
    if (facetsForm) bindFacetInputs();

    // Mobile filter drawer: overlay + botão fechar + ESC + foco preso.
    const toggle = $('[data-filters-toggle]');
    const facets = $('[data-facets]');
    const overlay = $('[data-facets-overlay]');
    if (toggle && facets) {
      let releaseFocus = null;
      const isMobile = () => window.matchMedia('(max-width: 989px)').matches;
      const openDrawer = () => {
        facets.classList.add('is-open');
        if (overlay) { overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add('is-open')); }
        toggle.setAttribute('aria-expanded', 'true');
        facets.setAttribute('aria-modal', 'true');
        document.body.classList.add('px-no-scroll');
        releaseFocus = trapFocus(facets);
        const closeBtn = $('[data-facets-close]', facets);
        if (closeBtn) closeBtn.focus();
      };
      const closeDrawer = () => {
        facets.classList.remove('is-open');
        if (overlay) { overlay.classList.remove('is-open'); setTimeout(() => { overlay.hidden = true; }, 300); }
        toggle.setAttribute('aria-expanded', 'false');
        facets.setAttribute('aria-modal', 'false');
        document.body.classList.remove('px-no-scroll');
        if (releaseFocus) { releaseFocus(); releaseFocus = null; }
        toggle.focus();
      };
      toggle.addEventListener('click', () => {
        if (facets.classList.contains('is-open')) closeDrawer(); else openDrawer();
      });
      const closeBtn = $('[data-facets-close]', facets);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      const applyBtn = $('[data-facets-apply]', facets);
      if (applyBtn) applyBtn.addEventListener('click', closeDrawer);
      if (overlay) overlay.addEventListener('click', closeDrawer);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && facets.classList.contains('is-open')) closeDrawer();
      });
      // Se a tela voltar para desktop com o drawer aberto, restaura o estado.
      window.addEventListener('resize', () => {
        if (!isMobile() && facets.classList.contains('is-open')) closeDrawer();
      });
    }

    window.addEventListener('popstate', () => applyUrl(window.location.href, false));
  }

  /* ---------- Related products (async section render) ------------------- */
  async function initRelated() {
    const el = $('[data-related-products]');
    if (!el || !el.dataset.url) return;
    if (el.querySelector('.px-product-grid')) return; // already server-rendered
    try {
      const res = await fetch(el.dataset.url);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const fresh = doc.querySelector('[data-related-products]');
      if (fresh && fresh.querySelector('.px-product-grid')) {
        // Injected <product-form> elements are upgraded automatically by the
        // browser, so their add-to-cart handlers bind without extra wiring.
        el.innerHTML = fresh.innerHTML;
        observeReveals(el);
      }
    } catch (e) { /* noop */ }
  }

  /* ---------- Reveal-on-scroll (progressive enhancement) ---------------- */
  let revealObserver;
  function observeReveals(ctx) {
    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]', ctx).forEach((el) => el.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    }
    $$('[data-reveal]:not(.is-visible)', ctx).forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Boot ------------------------------------------------------- */
  function init() {
    initGlobalCartControls();
    initMobileNav();
    initCollection();
    initRelated();
    observeReveals(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose a small API for debugging/integrations.
  window.Paulex = { Cart, Toast };
})();
