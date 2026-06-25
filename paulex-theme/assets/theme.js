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
      this.publish(cart);
      this.updateCount(cart.item_count);
      await this.refreshHTML();
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
      this.bindItemControls();
      // Re-bind controls whenever cart HTML is refreshed.
      Cart.subscribe(() => setTimeout(() => this.bindItemControls(), 50));
      this.bindExtras();
    }

    open() { this.controller && this.controller.open(); }

    bindItemControls() {
      $$('[data-qty-up]', this).forEach((b) => b.onclick = () => this.adjust(b.dataset.key, 1));
      $$('[data-qty-down]', this).forEach((b) => b.onclick = () => this.adjust(b.dataset.key, -1));
      $$('[data-qty-remove]', this).forEach((b) => b.onclick = () => this.setQty(b.dataset.key, 0));
      $$('[data-qty-input]', this).forEach((input) => {
        input.onchange = () => this.setQty(input.dataset.key, parseInt(input.value, 10) || 0);
      });
    }

    bindExtras() {
      // Note + coupon are re-bound via delegation since the body re-renders.
      this.addEventListener('input', (e) => {
        if (e.target.matches('[data-cart-note]')) {
          this.saveNote(e.target.value);
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

    saveNote = debounce(function (value) {
      fetch(Routes.cart_update_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: value })
      });
    }, 600);

    async adjust(key, delta) {
      const item = this.querySelector('[data-key="' + key + '"]');
      const input = item && item.querySelector('[data-qty-input]');
      const current = input ? parseInt(input.value, 10) : 1;
      await this.setQty(key, current + delta);
    }

    async setQty(key, quantity) {
      const row = this.querySelector('.px-cart-item[data-key="' + key + '"]');
      if (row) row.classList.add('is-updating');
      try {
        await Cart.change(key, Math.max(0, quantity));
      } catch (e) {
        Toast.show(Strings.quantityError || 'Erro', 'error');
      }
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
      if (this.input) {
        this.input.addEventListener('input', debounce(() => this.search(), 250));
      }
    }

    async search() {
      const q = this.input.value.trim();
      if (q.length < 2) { this.results.innerHTML = ''; return; }
      try {
        const url = (Routes.predictive_search_url || '/search/suggest') +
          '.json?q=' + encodeURIComponent(q) +
          '&resources[type]=product,collection,page&resources[limit]=6&resources[options][unavailable_products]=last';
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const data = await res.json();
        this.render(data.resources.results, q);
      } catch (e) { /* noop */ }
    }

    render(results, q) {
      const products = results.products || [];
      const collections = results.collections || [];
      const pages = results.pages || [];
      let html = '';

      if (!products.length && !collections.length && !pages.length) {
        this.results.innerHTML = '<div class="px-predictive__empty">' + (Strings.noResults || 'Nenhum resultado.') + '</div>';
        return;
      }

      if (products.length) {
        html += '<div class="px-predictive__group"><p class="px-predictive__heading">Produtos</p>';
        products.forEach((p) => {
          const img = p.featured_image && p.featured_image.url ? p.featured_image.url : (p.image || '');
          html += '<a class="px-predictive__product" href="' + p.url + '">' +
            (img ? '<img src="' + img + '&width=120" alt="" loading="lazy">' : '') +
            '<span><span class="px-predictive__product-title">' + p.title + '</span><br>' +
            '<span class="px-predictive__product-price">' + (p.price ? formatMoney(parseFloat(p.price) * 100) : '') + '</span></span></a>';
        });
        html += '</div>';
      }

      if (collections.length) {
        html += '<div class="px-predictive__group"><p class="px-predictive__heading">Categorias</p><div class="px-predictive__links">';
        collections.forEach((c) => { html += '<a href="' + c.url + '">' + c.title + '</a>'; });
        html += '</div></div>';
      }

      if (pages.length) {
        html += '<div class="px-predictive__group"><p class="px-predictive__heading">Páginas</p><div class="px-predictive__links">';
        pages.forEach((c) => { html += '<a href="' + c.url + '">' + c.title + '</a>'; });
        html += '</div></div>';
      }

      html += '<a class="px-predictive__all" href="/search?q=' + encodeURIComponent(q) + '">Ver todos os resultados &rarr;</a>';
      this.results.innerHTML = html;
    }
  }
  customElements.define('search-modal', SearchModal);

  /* ---------- Product form (AJAX add + variant switching) --------------- */
  class ProductForm extends HTMLElement {
    connectedCallback() {
      this.form = $('form[action*="/cart/add"]', this) || $('.px-product__add-form', this);
      this.variantInput = $('[data-variant-id]', this);
      this.variants = this.parseVariants();
      this.priceBlock = $('[data-price-block]', this.closest('.px-product') || document);

      if (this.form) this.form.addEventListener('submit', (e) => this.onSubmit(e));
      $$('[data-variant-option]', this).forEach((input) => input.addEventListener('change', () => this.onVariantChange()));
      this.initQty();
    }

    parseVariants() {
      const json = $('[data-variant-json]', this);
      if (!json) return [];
      try { return JSON.parse(json.textContent); } catch (e) { return []; }
    }

    initQty() {
      $$('[data-qty]', this).forEach((wrap) => {
        const input = $('[data-qty-input]', wrap);
        $('[data-qty-up]', wrap).addEventListener('click', () => { input.value = (parseInt(input.value, 10) || 1) + 1; });
        $('[data-qty-down]', wrap).addEventListener('click', () => { input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1); });
      });
    }

    onVariantChange() {
      const selected = $$('[data-option-index]', this).map((group) => {
        const checked = $('[data-variant-option]:checked', group);
        // sync pill visual state
        $$('.px-variant__pill', group).forEach((p) => p.classList.remove('is-selected'));
        if (checked) checked.closest('.px-variant__pill').classList.add('is-selected');
        return checked ? checked.value : null;
      });

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
        if (btn) {
          btn.disabled = !match.available;
          if (btnText) btnText.textContent = match.available ? (Strings.addToCart || 'Adicionar ao carrinho') : (Strings.soldOut || 'Esgotado');
        }
      } else if (btn) {
        btn.disabled = true;
      }
    }

    renderPrice(variant) {
      let html = '<div class="px-price' + (variant.compare_at_price > variant.price ? ' px-price--on-sale' : '') + '">';
      html += '<span class="px-price__current">' + formatMoney(variant.price) + '</span>';
      if (variant.compare_at_price > variant.price) {
        html += '<s class="px-price__compare">' + formatMoney(variant.compare_at_price) + '</s>';
      }
      html += '<span class="px-price__installments">ou 12x de ' + formatMoney(Math.round(variant.price / 12)) + '</span>';
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
    async calculate() {
      const cep = (this.input.value || '').replace(/\D/g, '');
      if (cep.length !== 8) { this.result.innerHTML = '<p style="color:var(--color-sale)">CEP inválido.</p>'; return; }
      this.result.textContent = 'Calculando frete…';
      try {
        // Validate the address via ViaCEP, then present estimated options.
        const res = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
        const data = await res.json();
        if (data.erro) throw new Error('CEP não encontrado');
        const local = [data.localidade, data.uf].filter(Boolean).join(' - ');
        this.result.innerHTML =
          '<p style="margin:.4rem 0;font-weight:600">' + local + '</p>' +
          '<div class="px-shipping__option"><span>Frete econômico</span><span>5–9 dias úteis</span></div>' +
          '<div class="px-shipping__option"><span>Frete expresso</span><span>2–4 dias úteis</span></div>' +
          '<p style="margin:.8rem 0 0;font-size:1.3rem;color:rgba(var(--color-text-rgb),.55)">Valores exatos calculados no checkout.</p>';
      } catch (e) {
        this.result.innerHTML = '<p style="color:var(--color-sale)">Não foi possível calcular. Verifique o CEP.</p>';
      }
    }
  }
  customElements.define('shipping-calculator', ShippingCalculator);

  /* ---------- Collection: facets + sort (AJAX) -------------------------- */
  function initCollection() {
    const grid = $('[data-product-grid]');
    const facetsForm = $('[data-facets-form]');
    const sortSelect = $('[data-sort-select]');
    if (!grid && !sortSelect) return;

    const applyUrl = async (url) => {
      try {
        const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const freshResults = doc.querySelector('.px-collection__results');
        const freshFacets = doc.querySelector('[data-facets-form]');
        const cur = $('.px-collection__results');
        if (freshResults && cur) cur.innerHTML = freshResults.innerHTML;
        if (freshFacets && facetsForm) facetsForm.innerHTML = freshFacets.innerHTML;
        history.pushState({}, '', url);
        window.scrollTo({ top: $('.px-collection__toolbar').offsetTop - 100, behavior: 'smooth' });
        bindFacetInputs();
      } catch (e) { window.location.href = url; }
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

    // Mobile filter toggle
    const toggle = $('[data-filters-toggle]');
    const facets = $('[data-facets]');
    if (toggle && facets) {
      toggle.addEventListener('click', () => {
        const open = facets.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('px-no-scroll', open);
      });
    }

    window.addEventListener('popstate', () => applyUrl(window.location.href));
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
