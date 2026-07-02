import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Placeholder } from "./Placeholder";
import { href } from "../lib/router";
import type { IconName, Tone } from "../data/catalog";

/* ----------------------------------------------------------------------------
 * Slider do hero da home (apenas apresentação). Avança sozinho a cada 6s,
 * pausa no hover/foco e respeita prefers-reduced-motion. Conteúdo dos slides
 * é estático (campanhas da loja) — nenhuma dependência de backend.
 * ------------------------------------------------------------------------- */

type Slide = {
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
  to: string;
  /* slide 1 usa a foto real; os demais usam o placeholder ícone+cor */
  img?: string;
  icon?: IconName;
  tone?: Tone;
  alt: string;
};

const HERO_IMG = `${import.meta.env.BASE_URL}img/paulex-hero.jpg`;

const SLIDES: Slide[] = [
  {
    eyebrow: "Desde 1984, com você",
    title: "Tudo para seu dia a dia.",
    lead: "Papelaria, utilidades, informática e brinquedos em um só lugar!",
    cta: "Comprar agora",
    to: "/produtos",
    img: HERO_IMG,
    alt: "Composição de produtos Paulex: cadernos, lápis de cor, canetas e resma de papel A4",
  },
  {
    eyebrow: "Volta às aulas",
    title: "Tudo para um novo começo.",
    lead: "Material escolar completo com preço justo para começar bem o ano.",
    cta: "Aproveitar ofertas",
    to: "/categoria/papelaria",
    icon: "pencil",
    tone: "blue",
    alt: "Campanha volta às aulas",
  },
  {
    eyebrow: "Tecnologia",
    title: "Conecte-se com o futuro.",
    lead: "Informática e acessórios com até 35% de desconto.",
    cta: "Ver ofertas",
    to: "/ofertas",
    icon: "monitor",
    tone: "violet",
    alt: "Campanha de tecnologia",
  },
];

const INTERVAL_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  /* Swipe por toque (mobile) — só apresentação */
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
  };

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="px-hs"
      aria-roledescription="carrossel"
      aria-label="Destaques da Paulex"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      data-reveal
    >
      <div className="px-hs__viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="px-hs__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {SLIDES.map((sl, i) => (
            <div key={sl.title} className="px-hs__slide" aria-hidden={i !== index}>
              <div className="px-hero">
                <div className="px-hero__copy">
                  <p className="px-hero__eyebrow">{sl.eyebrow}</p>
                  <h2 className="px-hero__title">{sl.title}</h2>
                  <p className="px-hero__lead">{sl.lead}</p>
                  <div className="px-hero__cta">
                    <a href={href(sl.to)} className="px-btn px-btn--red" tabIndex={i === index ? 0 : -1}>
                      {sl.cta} <Icon name="arrow" size={17} />
                    </a>
                  </div>
                </div>
                <div className="px-hero__visual">
                  {sl.img ? (
                    <img
                      src={sl.img}
                      alt={sl.alt}
                      className="px-hero__img"
                      width={830}
                      height={298}
                      fetchPriority={i === 0 ? "high" : undefined}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <div className="px-hero__ph">
                      <Placeholder label={sl.alt} icon={sl.icon ?? "stack"} tone={sl.tone ?? "soft"} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="px-hs__arrow px-hs__arrow--prev"
          onClick={() => go(index - 1)}
          aria-label="Slide anterior"
        >
          <Icon name="chevronL" size={18} />
        </button>
        <button
          type="button"
          className="px-hs__arrow px-hs__arrow--next"
          onClick={() => go(index + 1)}
          aria-label="Próximo slide"
        >
          <Icon name="chevronR" size={18} />
        </button>

        <div className="px-hs__dots" role="tablist" aria-label="Escolher slide">
          {SLIDES.map((sl, i) => (
            <button
              key={sl.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${sl.eyebrow}`}
              className={`px-hs__dot${i === index ? " px-hs__dot--on" : ""}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
