import { useCallback, useRef, useState, type FormEvent } from "react";
import { Icon } from "../components/Icon";
import { Placeholder } from "../components/Placeholder";
import { ProductCard } from "../components/ProductCard";
import { href } from "../lib/router";
import { WHATSAPP_CONTACT } from "../lib/format";
import {
  PRODUCTS, CATEGORY_CARDS, CAMPAIGNS, ATACADO_BENEFITS, BRANDS, BENEFITS,
  offers, categorySlug,
} from "../data/catalog";

const HERO_IMG = `${import.meta.env.BASE_URL}img/paulex-hero.jpg`;
const bestSellers = PRODUCTS.slice(0, 10);
const offerProducts = offers();

export function Home() {
  const bestRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  const scrollRow = useCallback((el: HTMLDivElement | null, dir: number) => {
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 700), behavior: "smooth" });
  }, []);

  const onNewsletter = useCallback((e: FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setNewsletterMsg("Digite um e-mail válido para continuar.");
      return;
    }
    setNewsletterMsg("Pronto! Você vai receber nossas novidades. 🎉");
    setEmail("");
  }, [email]);

  return (
    <main id="topo">
      {/* 1 · BANNER */}
      <section className="px-section">
        <div className="px-hero" data-reveal>
          <div className="px-hero__copy">
            <p className="px-hero__eyebrow">Desde 1984, com você</p>
            <h1 className="px-hero__title">
              Tudo para escola, casa e <span className="px-hero__mark">trabalho</span>
            </h1>
            <p className="px-hero__lead">
              Papelaria, utilidades, cosméticos, brinquedos, informática e acessórios em um só lugar.
            </p>
            <div className="px-hero__cta">
              <a href={href("/ofertas")} className="px-btn px-btn--red">
                Ver ofertas <Icon name="arrow" size={17} />
              </a>
              <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-btn px-btn--outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" />
                </svg>
                Falar no WhatsApp
              </a>
            </div>
          </div>
          <div className="px-hero__visual">
            <img
              src={HERO_IMG}
              alt="Composição de produtos Paulex: cadernos, lápis de cor, canetas e resma de papel A4"
              className="px-hero__img"
              width={830}
              height={298}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* 2 · CATEGORIAS */}
      <section id="categorias" className="px-section px-section--pad">
        <div className="px-rowhead">
          <h2 className="px-h2" data-reveal>Compre por categoria</h2>
          <a href={href("/produtos")} className="px-seeall" data-reveal>Ver todos os produtos →</a>
        </div>
        <div className="px-cats">
          {CATEGORY_CARDS.map((u) => (
            <a href={href(`/categoria/${categorySlug(u.name)}`)} className="px-cat" data-reveal key={u.name}>
              <span className={`px-cat__icon px-cat__icon--${u.tone}`}>
                <Icon name={u.icon} size={26} />
              </span>
              <span className="px-cat__text">
                <span className="px-cat__name">{u.name}</span>
                <span className="px-cat__link">Ver produtos <Icon name="arrow" size={13} /></span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 3 · MAIS VENDIDOS */}
      <section className="px-section px-section--pad">
        <div className="px-rowhead">
          <h2 className="px-h2" data-reveal>Os mais vendidos</h2>
          <div className="px-rowhead__nav">
            <a href={href("/produtos")} className="px-seeall" data-reveal>Ver todos os produtos →</a>
            <div className="px-arrows">
              <button className="px-arrowbtn" aria-label="Produtos anteriores" onClick={() => scrollRow(bestRef.current, -1)}><Icon name="chevronL" /></button>
              <button className="px-arrowbtn" aria-label="Próximos produtos" onClick={() => scrollRow(bestRef.current, 1)}><Icon name="chevronR" /></button>
            </div>
          </div>
        </div>
        <div className="px-scroll" ref={bestRef}>
          {bestSellers.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* 4 · OFERTAS DA SEMANA */}
      <section id="ofertas" className="px-section px-section--pad">
        <div className="px-promo" data-reveal>
          <div className="px-promo__glow" aria-hidden="true" />
          <div className="px-promo__copy">
            <span className="px-promo__tag">Ofertas da semana</span>
            <h2 className="px-promo__title">Até 40% de desconto</h2>
            <p className="px-promo__lead">Em papelaria, informática e utilidades.</p>
            <a href={href("/ofertas")} className="px-btn px-btn--red px-promo__btn">
              Ver ofertas <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="px-promo__media">
            <img src={HERO_IMG} alt="Produtos Paulex em oferta" className="px-promo__img" width={830} height={298} loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="px-rowhead px-rowhead--sub">
          <h3 className="px-h2 px-h2--sm" data-reveal>Aproveite as ofertas</h3>
          <div className="px-rowhead__nav">
            <a href={href("/ofertas")} className="px-seeall" data-reveal>Ver todas as ofertas →</a>
            <div className="px-arrows">
              <button className="px-arrowbtn" aria-label="Ofertas anteriores" onClick={() => scrollRow(offerRef.current, -1)}><Icon name="chevronL" /></button>
              <button className="px-arrowbtn" aria-label="Próximas ofertas" onClick={() => scrollRow(offerRef.current, 1)}><Icon name="chevronR" /></button>
            </div>
          </div>
        </div>
        <div className="px-scroll" ref={offerRef}>
          {offerProducts.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* 5 · CAMPANHAS */}
      <section className="px-section px-section--pad">
        <div className="px-camps">
          {CAMPAIGNS.map((c) => (
            <a href={href(`/categoria/${categorySlug(c.category)}`)} className="px-camp" data-reveal key={c.tag}>
              <Placeholder label={c.tag} icon="tag" tone={c.tone} className="px-camp__bg" />
              <div className="px-camp__veil" aria-hidden="true" />
              <div className="px-camp__body">
                <div>
                  <p className="px-camp__tag">{c.tag}</p>
                  <h3 className="px-camp__title">{c.title}</h3>
                  <p className="px-camp__off"><span>até </span>{c.off}<span> OFF</span></p>
                </div>
                <span className="px-camp__cta">{c.cta} <Icon name="arrow" size={15} /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 6 · ATACADO */}
      <section id="atacado" className="px-section px-section--pad">
        <div className="px-atac-card" data-reveal>
          <div className="px-atac">
            <div className="px-atac__copy">
              <span className="px-atac__chip"><Icon name="boxes" size={14} />Paulex Atacado</span>
              <h2 className="px-atac__title">Comprando para sua empresa?</h2>
              <p className="px-atac__lead">
                Condições especiais para empresas, escolas, escritórios, condomínios, igrejas e revendedores.
              </p>
              <div className="px-atac__cta">
                <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-btn px-btn--primary px-btn--sm">Solicitar orçamento</a>
                <a href={href("/produtos")} className="px-btn px-btn--ghost px-btn--sm">Conhecer os produtos</a>
              </div>
            </div>
            <div className="px-atac__benefits">
              {ATACADO_BENEFITS.map((b) => (
                <div className="px-atac__ben" key={b.title}>
                  <span className="px-atac__benicon"><Icon name={b.icon} size={19} /></span>
                  <div>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-atac__media">
              <Placeholder label="Atendimento a empresas" icon="users" tone="blue" className="px-atac__ph" />
              <div className="px-atac__veil" aria-hidden="true" />
              <p className="px-atac__caption">Enviamos para todo o Rio de Janeiro com excelência e agilidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · MARCAS */}
      <section className="px-section px-section--pad">
        <div className="px-rowhead px-rowhead--brands">
          <h2 className="px-h2 px-h2--sm" data-reveal>As melhores marcas você encontra aqui</h2>
          <a href={href("/produtos")} className="px-seeall" data-reveal>Ver todos os produtos →</a>
        </div>
        <div className="px-brands" data-reveal>
          {BRANDS.map((b) => <span className="px-brand" key={b}>{b}</span>)}
        </div>
      </section>

      {/* 8 · NEWSLETTER */}
      <section className="px-section px-section--pad">
        <div className="px-news" data-reveal>
          <div className="px-news__intro">
            <span className="px-news__icon"><Icon name="mail" size={26} /></span>
            <div>
              <h3 className="px-news__title">Receba novidades e ofertas da Paulex</h3>
              <p className="px-news__desc">Promoções, novidades e oportunidades para comprar melhor.</p>
            </div>
          </div>
          <form className="px-news__form" onSubmit={onNewsletter} noValidate>
            <label htmlFor="px-email" className="px-sr-only">Seu e-mail</label>
            <input id="px-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setNewsletterMsg(null); }} placeholder="Seu melhor e-mail" autoComplete="email" />
            <button type="submit">Cadastrar</button>
            {newsletterMsg && <p className="px-news__msg" role="status">{newsletterMsg}</p>}
          </form>
        </div>
      </section>

      {/* 9 · BENEFÍCIOS */}
      <section className="px-benefits-wrap">
        <div className="px-benefits">
          {BENEFITS.map((b) => (
            <div className="px-benefit" key={b.title} data-reveal>
              <span className="px-benefit__icon"><Icon name={b.icon} size={26} /></span>
              <div>
                <div className="px-benefit__title">{b.title}</div>
                <div className="px-benefit__desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
