import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/ProductCard";
import { SearchBox } from "../components/SearchBox";
import { Footer } from "../components/Footer";
import { Icon, ICONS } from "../components/Icon";
import { money } from "../lib/format";
import { openWhatsApp } from "../lib/whatsapp";

export function Home() {
  const navigate = useNavigate();
  const { products, recent, cartCount } = useStore();

  const maisVendidos = products.filter((p) => p.maisVendido);
  const promos = products.filter((p) => p.promo).slice(0, 4);
  const recentes = recent
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="screen active">
      <header className="topbar home-topbar">
        <button className="icon-btn" aria-label="Menu" onClick={() => navigate("/categorias")}>
          <Icon path={ICONS.menu} />
        </button>
        <h1 className="home-logo">
          <img src="img/logo.png" alt="Paulex" className="logo-img logo-img-top" />
        </h1>
        <button
          className="icon-btn has-badge"
          aria-label="Carrinho"
          onClick={() => navigate("/carrinho")}
        >
          <Icon path={ICONS.cart} />
          {cartCount > 0 && <span className="badge cart-badge">{cartCount}</span>}
        </button>
      </header>

      <div className="hero">
        <p className="eyebrow">Paulex Armarinho · Desde 1984</p>
        <h2>
          Há mais de 40 anos facilitando
          <br />o dia a dia dos brasileiros.
        </h2>
        <p className="hero-sub">
          Produtos para papelaria, informática, utilidades, brinquedos,
          descartáveis e muito mais.
        </p>
        <div className="cta-row">
          <button className="pill pill-white" onClick={() => navigate("/lista/maisvendidos")}>
            Comprar agora
          </button>
          <button className="pill pill-ghost" onClick={() => openWhatsApp()}>
            <Icon path={ICONS.whatsapp} /> Falar no WhatsApp
          </button>
        </div>
        <ul className="hero-badges">
          <li>✓ Desde 1984</li>
          <li>✓ Atacado e Varejo</li>
          <li>✓ Frete grátis acima de R$ 99</li>
          <li>✓ Atendimento via WhatsApp</li>
        </ul>
      </div>

      <SearchBox />

      {recentes.length > 0 && (
        <div className="recent">
          <div className="wrap">
            <h3 className="rel-title">Vistos recentemente</h3>
            <div className="suggest-row">
              {recentes.map((p) => (
                <button key={p.id} className="mini-card" onClick={() => navigate(`/produto/${p.id}`)}>
                  <span className="mini-name">{p.nome}</span>
                  <span className="mini-price">{money(p.preco)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="section about">
        <div className="wrap">
          <h3 className="sec-title">Sobre a Paulex.</h3>
          <p className="sec-sub about-text">
            Desde 1984, a Paulex Armarinho atende clientes de todo o Brasil
            oferecendo variedade, qualidade e preços competitivos. Nosso
            compromisso é entregar confiança, atendimento próximo e soluções para
            o dia a dia.
          </p>
          <div className="stats">
            <div className="stat"><strong>40+</strong><small>anos de história</small></div>
            <div className="stat"><strong>Milhares</strong><small>de clientes atendidos</small></div>
            <div className="stat"><strong>Atacado</strong><small>e varejo</small></div>
            <div className="stat"><strong>Atendimento</strong><small>especializado</small></div>
          </div>
        </div>
      </div>

      <div className="section alt">
        <div className="wrap">
          <h3 className="sec-title">Categorias.</h3>
          <p className="sec-sub">Seis universos. Um só lugar.</p>
          <div className="cat-row">
            {CATEGORIES.map((c) => (
              <button key={c.id} className="cat-chip" onClick={() => navigate(`/lista/cat:${c.id}`)}>
                <Icon path={c.icon} />
                {c.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section vendidos">
        <div className="wrap">
          <h3 className="sec-title">Mais vendidos.</h3>
          <p className="sec-sub">Os favoritos de quem compra todo mês.</p>
          <div className="product-grid">
            {maisVendidos.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          <button className="pill pill-blue sec-cta" onClick={() => navigate("/lista/maisvendidos")}>
            Ver todos
          </button>
        </div>
      </div>

      <div className="section alt">
        <div className="wrap">
          <h3 className="sec-title">Ofertas da semana.</h3>
          <p className="sec-sub">Preços que valem o clique.</p>
          <div className="product-grid">
            {promos.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          <button className="pill pill-red sec-cta" onClick={() => navigate("/lista/promocoes")}>
            Ver todas as ofertas
          </button>
        </div>
      </div>

      <div className="section club-promo">
        <div className="wrap">
          <span className="club-promo-ico">
            <Icon path={ICONS.crown} />
          </span>
          <h3 className="sec-title">Paulex Club.</h3>
          <p className="sec-sub">
            Pontos, cupons, cashback e frete especial em todas as compras.
          </p>
          <button className="pill pill-gold" onClick={() => navigate("/club")}>
            Conhecer o Club
          </button>
        </div>
      </div>

      <div className="trust">
        <div className="wrap">
          <h3 className="sec-title why-title">Por que comprar na Paulex?</h3>
          <div className="trust-grid">
            <div className="trust-item">
              <Icon path={ICONS.store} />
              <strong>Empresa desde 1984</strong>
              <small>Tradição que atravessa gerações</small>
            </div>
            <div className="trust-item">
              <Icon path={ICONS.shield} />
              <strong>Compra 100% segura</strong>
              <small>Seus dados protegidos</small>
            </div>
            <div className="trust-item">
              <Icon path={ICONS.whatsapp} />
              <strong>Atendimento via WhatsApp</strong>
              <small>Resposta rápida e próxima</small>
            </div>
            <div className="trust-item">
              <Icon path={ICONS.truck} />
              <strong>Entrega rápida</strong>
              <small>Frete grátis acima de R$ 99</small>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
