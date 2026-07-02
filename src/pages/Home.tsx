import { useCallback, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "../components/Icon";
import { Placeholder } from "../components/Placeholder";
import { ProductCard } from "../components/ProductCard";
import { HeroSlider } from "../components/HeroSlider";
import { href } from "../lib/router";
import { WHATSAPP_CONTACT } from "../lib/format";
import { useProducts } from "../lib/products";
import { useCategories } from "../lib/categories";
import {
  ATACADO_BENEFITS, BRANDS, BENEFITS, TRUST_ITEMS, type IconName, type Product,
} from "../data/catalog";

/* Ordem preferida das seções de categoria na home (ref. visual);
   categorias ativas fora desta lista entram em seguida, na ordem do banco. */
const PREFERRED_SECTIONS = ["Papelaria", "Utilidades", "Informática", "Brinquedos"];

/* Faixa de benefícios/confiança (cartão branco com 4 itens) */
function Perks({ items }: { items: { title: string; desc: string; icon: IconName }[] }) {
  return (
    <div className="px-perks" data-reveal>
      {items.map((b) => (
        <div className="px-perk" key={b.title}>
          <span className="px-perk__icon"><Icon name={b.icon} size={26} /></span>
          <span>
            <span className="px-perk__title">{b.title}</span>
            <span className="px-perk__desc">{b.desc}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* Carrossel horizontal de produtos com cabeçalho, setas e skeleton */
function ProductRow({
  title,
  seeAllHref,
  seeAllLabel,
  products,
  loading,
  titleExtra,
}: {
  title: string;
  seeAllHref: string;
  seeAllLabel: string;
  products: Product[];
  loading: boolean;
  titleExtra?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRow = useCallback((dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 700), behavior: "smooth" });
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="px-section px-section--pad">
      <div className="px-rowhead">
        <h2 className="px-h2 px-h2--sm" data-reveal>{titleExtra}{title}</h2>
        <div className="px-rowhead__nav">
          <a href={seeAllHref} className="px-seeall" data-reveal>{seeAllLabel} →</a>
          <div className="px-arrows">
            <button className="px-arrowbtn" aria-label={`${title}: anteriores`} onClick={() => scrollRow(-1)}><Icon name="chevronL" /></button>
            <button className="px-arrowbtn" aria-label={`${title}: próximos`} onClick={() => scrollRow(1)}><Icon name="chevronR" /></button>
          </div>
        </div>
      </div>
      <div className="px-scroll" ref={ref}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div className="px-card px-skel" key={i} aria-hidden="true">
                <div className="px-skel__block px-skel__media" />
                <div className="px-skel__block px-skel__line" style={{ width: "85%" }} />
                <div className="px-skel__block px-skel__line" style={{ width: "55%" }} />
                <div className="px-skel__block px-skel__line" style={{ width: "70%", height: 20 }} />
              </div>
            ))
          : products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

export function Home() {
  const { products, offers, byCategory, loading } = useProducts();
  const { categories } = useCategories();
  const [email, setEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  const offerProducts = offers();
  /* fallback: sem ofertas cadastradas, a vitrine mostra os destaques/novidades */
  const featured = products.filter((p) => p.isFeatured);
  const dailyOffers = offerProducts.length > 0 ? offerProducts : (featured.length > 0 ? featured : products).slice(0, 10);

  /* Seções por categoria: ordem preferida primeiro, demais ativas depois */
  const orderedCategories = [
    ...PREFERRED_SECTIONS.map((name) => categories.find((c) => c.name === name)).filter(
      (c): c is NonNullable<typeof c> => !!c
    ),
    ...categories.filter((c) => !PREFERRED_SECTIONS.includes(c.name)),
  ];

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
      {/* 1 · HERO (slider) */}
      <section className="px-section">
        <HeroSlider />
      </section>

      {/* 2 · BENEFÍCIOS */}
      <section className="px-section">
        <Perks items={BENEFITS} />
      </section>

      {/* 3 · OFERTAS DO DIA */}
      <ProductRow
        title="Ofertas do Dia"
        titleExtra={<span aria-hidden="true" style={{ marginRight: 10 }}>🔥</span>}
        seeAllHref={href("/ofertas")}
        seeAllLabel="Ver todas as ofertas"
        products={dailyOffers}
        loading={loading}
      />

      {/* 4 · SEÇÕES POR CATEGORIA */}
      {loading && orderedCategories.length === 0 ? (
        <ProductRow
          title="Carregando a loja…"
          seeAllHref={href("/produtos")}
          seeAllLabel="Ver todos os produtos"
          products={[]}
          loading
        />
      ) : (
        orderedCategories.map((c) => (
          <ProductRow
            key={c.slug}
            title={c.name}
            seeAllHref={href(`/categoria/${c.slug}`)}
            seeAllLabel="Ver todos"
            products={byCategory(c.name)}
            loading={loading}
          />
        ))
      )}

      {/* 5 · ATACADO */}
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

      {/* 6 · MARCAS */}
      <section className="px-section px-section--pad">
        <div className="px-rowhead px-rowhead--brands">
          <h2 className="px-h2 px-h2--sm" data-reveal>As melhores marcas você encontra aqui</h2>
          <a href={href("/produtos")} className="px-seeall" data-reveal>Ver todos os produtos →</a>
        </div>
        <div className="px-brands" data-reveal>
          {BRANDS.map((b) => <span className="px-brand" key={b}>{b}</span>)}
        </div>
      </section>

      {/* 7 · NEWSLETTER */}
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

      {/* 8 · CONFIANÇA */}
      <section className="px-section px-section--pad" style={{ paddingBottom: 8 }}>
        <Perks items={TRUST_ITEMS} />
      </section>
    </main>
  );
}
