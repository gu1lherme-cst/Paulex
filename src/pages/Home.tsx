import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import "./Home.css";

/* ----------------------------------------------------------------------------
 * Paulex Armarinho — homepage
 * Reconstrução funcional (React) do protótipo de design. Todas as imagens são
 * placeholders em CSS/SVG, prontos para troca pelos arquivos reais.
 * ------------------------------------------------------------------------- */

type Tone = "blue" | "red" | "soft" | "violet" | "teal" | "amber";

/* ----------------------------- Ícones ------------------------------------ */

type IconName =
  | "pin"
  | "medal"
  | "shield"
  | "headset"
  | "store"
  | "menu"
  | "user"
  | "heart"
  | "cart"
  | "arrow"
  | "chevronL"
  | "chevronR"
  | "search"
  | "plus"
  | "stack"
  | "tag"
  | "truck"
  | "box"
  | "check"
  | "mail"
  | "up"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "pencil"
  | "cup"
  | "users"
  | "monitor"
  | "lipstick"
  | "trash"
  | "list"
  | "calendar"
  | "boxes";

const iconPaths: Record<IconName, ReactNode> = {
  pin: (
    <>
      <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13l-1.4 7L12 17.6 16.4 20 15 13" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="M9.3 12l1.8 1.8 3.6-3.8" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2z" />
      <path d="M20 13v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z" />
    </>
  ),
  store: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  cart: (
    <>
      <path d="M6 7h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 18z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  chevronL: <path d="M15 6l-6 6 6 6" />,
  chevronR: <path d="M9 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  stack: (
    <>
      <path d="M12 3l8 4v10l-8 4-8-4V7z" />
      <path d="M4 7l8 4 8-4" />
      <path d="M12 11v10" />
    </>
  ),
  tag: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 14h2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 13l2-6h9v10H3z" />
      <path d="M14 9h3l3 4v3h-6z" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </>
  ),
  box: (
    <>
      <path d="M3 6l9-3 9 3-9 3z" />
      <path d="M3 6v7l9 3 9-3V6" />
    </>
  ),
  check: (
    <>
      <path d="M9 11l3 3 8-8" />
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  up: (
    <>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </>
  ),
  whatsapp: <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V3h-2.5A4 4 0 0 0 10.5 7v1.5H8V11h2.5v8H14v-8h2l.5-2.5z" />
  ),
  pencil: (
    <>
      <path d="M4 4h11l5 5v11H4z" />
      <path d="M8 9h6" />
      <path d="M8 13h8" />
    </>
  ),
  cup: (
    <>
      <path d="M6 3h12l-1 5H7z" />
      <path d="M7 8v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
    </>
  ),
  lipstick: (
    <>
      <path d="M9 3h6v4H9z" />
      <path d="M8 7h8l1 13H7z" />
    </>
  ),
  trash: (
    <>
      <path d="M6 3h12l-1.5 18h-9z" />
      <path d="M8 9h8" />
    </>
  ),
  list: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 4v5" />
    </>
  ),
  boxes: (
    <>
      <path d="M3 9h18" />
      <path d="M5 9V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M4 9l1 10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1l1-10" />
    </>
  ),
};

const Icon = memo(function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths[name]}
    </svg>
  );
});

/* ----------------------------- Placeholder ------------------------------- */

function Placeholder({
  label,
  icon,
  tone = "soft",
  className,
}: {
  label: string;
  icon: IconName;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`px-ph px-ph--${tone}${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={label}
    >
      <span className="px-ph__icon">
        <Icon name={icon} size={34} />
      </span>
      <span className="px-ph__label">{label}</span>
    </div>
  );
}

/* ------------------------------- Estrelas -------------------------------- */

function Stars({ n, reviews }: { n: number; reviews: string }) {
  return (
    <div className="px-stars">
      <span className="px-stars__row" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < n ? "#F5A623" : "#E2E4E8"}>
            <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
          </svg>
        ))}
      </span>
      <span className="px-stars__count">
        <span className="px-sr-only">{n} de 5 estrelas, </span>({reviews})
      </span>
    </div>
  );
}

/* -------------------------------- Dados ---------------------------------- */

const universos: { name: string; desc: string; icon: IconName; tone: Tone }[] = [
  { name: "Papelaria", desc: "Cadernos, canetas e material escolar", icon: "pencil", tone: "blue" },
  { name: "Utilidades", desc: "Organização, limpeza e muito mais", icon: "cup", tone: "teal" },
  { name: "Brinquedos", desc: "Diversão para todas as idades", icon: "users", tone: "amber" },
  { name: "Informática", desc: "Tecnologia que simplifica o seu dia", icon: "monitor", tone: "violet" },
  { name: "Cosméticos", desc: "Cuidados diários com as melhores marcas", icon: "lipstick", tone: "red" },
  { name: "Descartáveis", desc: "Soluções práticas para o dia a dia", icon: "trash", tone: "soft" },
];

const benefits: { title: string; desc: string; icon: IconName }[] = [
  { title: "Variedade completa", desc: "Para casa, escola e trabalho", icon: "stack" },
  { title: "Preços justos", desc: "Condições que cabem no bolso", icon: "tag" },
  { title: "Compra segura", desc: "Proteção dos seus dados", icon: "shield" },
  { title: "Entrega rápida", desc: "Para todo o Rio de Janeiro", icon: "truck" },
  { title: "Atendimento humano", desc: "Equipe especializada", icon: "headset" },
];

type Product = {
  id: string;
  name: string;
  price: string;
  installment: string;
  n: number;
  reviews: string;
  badge?: string;
  badgeTone?: "blue" | "red";
  icon: IconName;
  tone: Tone;
};

const bestsellers: Product[] = [
  { id: "px-b1", name: "Caderno inteligente capa dura A5", price: "R$ 49,90", installment: "em 3x sem juros", n: 5, reviews: "1.245", badge: "Novo", badgeTone: "blue", icon: "pencil", tone: "blue" },
  { id: "px-b2", name: "Mouse sem fio silencioso USB-C", price: "R$ 89,90", installment: "em 6x sem juros", n: 4, reviews: "982", badge: "Oferta", badgeTone: "red", icon: "monitor", tone: "violet" },
  { id: "px-b3", name: "Organizador modular de mesa", price: "R$ 64,90", installment: "em 4x sem juros", n: 5, reviews: "1.103", icon: "cup", tone: "teal" },
  { id: "px-b4", name: "Kit cuidados diários essencial", price: "R$ 79,90", installment: "em 4x sem juros", n: 4, reviews: "875", icon: "lipstick", tone: "red" },
  { id: "px-b5", name: "Fone de ouvido Bluetooth", price: "R$ 129,90", installment: "em 6x sem juros", n: 5, reviews: "1.782", badge: "Novo", badgeTone: "blue", icon: "monitor", tone: "violet" },
  { id: "px-b6", name: "Impressora multifuncional Wi-Fi", price: "R$ 899,10", installment: "em 10x sem juros", n: 4, reviews: "967", badge: "Oferta", badgeTone: "red", icon: "monitor", tone: "soft" },
];

const campaigns: { tag: string; title: string; off: string; cta: string; tone: Tone }[] = [
  { tag: "Volta às aulas", title: "Tudo para um novo começo", off: "30%", cta: "Aproveitar ofertas", tone: "blue" },
  { tag: "Home office", title: "Mais produtividade no seu dia", off: "25%", cta: "Ver produtos", tone: "teal" },
  { tag: "Tecnologia", title: "Conecte-se com o futuro", off: "35%", cta: "Ver ofertas", tone: "violet" },
];

const atacadoBenefits: { title: string; desc: string; icon: IconName }[] = [
  { title: "Preços por volume", desc: "Condições exclusivas para grandes compras", icon: "box" },
  { title: "Atendimento especializado", desc: "Equipe dedicada ao seu negócio", icon: "users" },
  { title: "Orçamentos rápidos", desc: "Resposta em até 24h para o seu negócio", icon: "check" },
  { title: "Entrega programada", desc: "Mais agilidade e flexibilidade", icon: "calendar" },
  { title: "Grande variedade", desc: "Tudo em um só fornecedor", icon: "list" },
  { title: "40 anos de tradição", desc: "Confiança que gera parcerias", icon: "medal" },
];

const brands = [
  "Faber-Castell", "BIC", "Tilibra", "CIS", "HP", "EPSON", "Logitech",
  "Tramontina", "3M", "Acrilex", "Pilot", "Maped", "Stabilo",
];

const categories = [
  "Todas as categorias", "Papelaria", "Utilidades", "Brinquedos",
  "Informática", "Cosméticos", "Descartáveis",
];

/* ------------------------------ Logo (SVG) ------------------------------- */

function Logo({ variant = "light" }: { variant?: "light" | "muted" }) {
  return (
    <span className={`px-logo px-logo--${variant}`} aria-label="Paulex">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" opacity="0.16" />
        <path d="M7 17V7h4.2a3.2 3.2 0 0 1 0 6.4H9.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="px-logo__word">Paulex</span>
    </span>
  );
}

/* --------------------------------- Page ---------------------------------- */

export default function Home() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const univRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);

  const [cart, setCart] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [email, setEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  /* Reveal on scroll */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("px-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("px-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Sombra no header sticky ao rolar */
  useEffect(() => {
    const onScroll = () => {
      const h = stickyRef.current;
      if (!h) return;
      h.style.boxShadow = window.scrollY > 6 ? "0 4px 20px rgba(16,24,40,.12)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollRow = useCallback((el: HTMLDivElement | null, dir: number) => {
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 700), behavior: "smooth" });
  }, []);

  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  const onSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const q = search.trim();
      const target = document.getElementById("universos");
      if (target) target.scrollIntoView({ behavior: "smooth" });
      if (q) console.info(`Buscar "${q}" em ${category}`);
    },
    [search, category]
  );

  const onNewsletter = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!ok) {
        setNewsletterMsg("Digite um e-mail válido para continuar.");
        return;
      }
      setNewsletterMsg("Pronto! Você vai receber nossas novidades. 🎉");
      setEmail("");
    },
    [email]
  );

  const addToCart = useCallback(() => setCart((c) => c + 1), []);

  return (
    <div className="px-root">
      {/* 1 · TOP BAR */}
      <div className="px-topbar">
        <div className="px-topbar__in">
          <div className="px-topbar__left">
            <span><Icon name="pin" size={14} />Enviamos para todo o Rio de Janeiro</span>
            <span><Icon name="medal" size={14} />Mais de 40 anos de tradição</span>
            <span><Icon name="shield" size={14} />Compra 100% segura</span>
            <span><Icon name="headset" size={14} />Atendimento humano</span>
          </div>
          <div className="px-topbar__right">
            <a href="#lojas" className="px-navlink"><Icon name="store" size={14} />Nossas lojas</a>
            <a href="#ajuda" className="px-navlink">Ajuda</a>
          </div>
        </div>
      </div>

      {/* STICKY: HEADER + MENU */}
      <div className="px-sticky" ref={stickyRef}>
        {/* 2 · HEADER */}
        <div className="px-header">
          <div className="px-header__in">
            <a href="#topo" className="px-header__logo" aria-label="Paulex — página inicial">
              <Logo />
            </a>

            <form className="px-search" role="search" onSubmit={onSearch}>
              <label htmlFor="px-q" className="px-sr-only">O que você procura</label>
              <span className="px-search__icon"><Icon name="search" size={19} /></span>
              <input
                id="px-q"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="O que você precisa hoje?"
              />
              <label htmlFor="px-cat" className="px-sr-only">Categoria</label>
              <select id="px-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button type="submit">
                Buscar <Icon name="search" size={16} />
              </button>
            </form>

            <div className="px-acctbar">
              <a href="#entrar" className="px-acct">
                <Icon name="user" size={22} />
                <span className="px-acct__txt">
                  <span className="px-acct__title">Entrar</span>
                  <span className="px-acct__sub">Minha conta</span>
                </span>
              </a>
              <a href="#favoritos" className="px-acct">
                <Icon name="heart" size={22} />
                <span className="px-acct__txt">
                  <span className="px-acct__title">Favoritos</span>
                  <span className="px-acct__sub">Lista de desejos</span>
                </span>
              </a>
              <a href="#carrinho" className="px-acct">
                <span className="px-acct__cart">
                  <Icon name="cart" size={23} />
                  <span className="px-acct__badge" aria-hidden="true">{cart}</span>
                </span>
                <span className="px-acct__txt">
                  <span className="px-acct__title">Carrinho</span>
                  <span className="px-acct__sub">{cart} {cart === 1 ? "item" : "itens"}</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* 3 · MENU DE CATEGORIAS */}
        <nav className="px-menu" aria-label="Categorias">
          <div className="px-menu__in">
            <span className="px-menu__all"><Icon name="menu" size={18} />Todas as categorias</span>
            <a href="#universos" className="px-navlink">Papelaria</a>
            <a href="#universos" className="px-navlink">Utilidades</a>
            <a href="#universos" className="px-navlink">Brinquedos</a>
            <a href="#universos" className="px-navlink">Informática e acessórios</a>
            <a href="#universos" className="px-navlink">Cosméticos</a>
            <a href="#universos" className="px-navlink">Descartáveis</a>
            <a href="#atacado" className="px-navlink px-menu__atac">Atacado</a>
            <a href="#ofertas" className="px-navlink px-menu__off">Ofertas</a>
          </div>
        </nav>
      </div>

      <main id="topo">
        {/* 4 · HERO */}
        <section className="px-section">
          <div className="px-hero">
            <div className="px-hero__copy">
              <p className="px-hero__eyebrow" data-reveal>Desde 1984, com você</p>
              <h1 className="px-hero__title" data-reveal>
                Tudo para escola, casa e <span className="px-hero__mark">trabalho</span>
              </h1>
              <p className="px-hero__lead" data-reveal>
                Papelaria, utilidades, descartáveis, brinquedos, cosméticos e acessórios em um só lugar.
              </p>
              <div className="px-hero__cta" data-reveal>
                <a href="#ofertas" className="px-btn px-btn--primary">
                  Ver ofertas <Icon name="arrow" size={17} />
                </a>
                <a href="#whatsapp" className="px-btn px-btn--ghost">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" />
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            <div className="px-hero__visual" data-reveal>
              <Placeholder label="Produtos Paulex" icon="stack" tone="blue" className="px-hero__ph" />
            </div>
          </div>
        </section>

        {/* 5 · BENEFÍCIOS RÁPIDOS */}
        <section className="px-benefits-wrap">
          <div className="px-benefits">
            {benefits.map((b) => (
              <div className="px-benefit" key={b.title}>
                <span className="px-benefit__icon"><Icon name={b.icon} size={28} /></span>
                <div>
                  <div className="px-benefit__title">{b.title}</div>
                  <div className="px-benefit__desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 · NOSSOS UNIVERSOS */}
        <section id="universos" className="px-section px-section--pad">
          <div className="px-rowhead">
            <h2 className="px-h2" data-reveal>Nossos universos</h2>
            <div className="px-rowhead__nav">
              <a href="#universos" className="px-seeall" data-reveal>Ver todos os universos →</a>
              <div className="px-arrows">
                <button className="px-arrowbtn" aria-label="Universos anteriores" onClick={() => scrollRow(univRef.current, -1)}>
                  <Icon name="chevronL" />
                </button>
                <button className="px-arrowbtn" aria-label="Próximos universos" onClick={() => scrollRow(univRef.current, 1)}>
                  <Icon name="chevronR" />
                </button>
              </div>
            </div>
          </div>
          <div className="px-scroll" ref={univRef}>
            {universos.map((u) => (
              <a href="#universos" className="px-card px-univ" data-reveal key={u.name}>
                <div className="px-univ__img">
                  <Placeholder label={u.name} icon={u.icon} tone={u.tone} />
                </div>
                <div className="px-univ__row">
                  <h3 className="px-univ__name">{u.name}</h3>
                  <span className="px-univ__arrow"><Icon name="arrow" size={17} /></span>
                </div>
                <p className="px-univ__desc">{u.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* 7 · MAIS VENDIDOS */}
        <section className="px-section px-section--pad">
          <div className="px-rowhead">
            <h2 className="px-h2" data-reveal>Os mais vendidos</h2>
            <div className="px-rowhead__nav">
              <a href="#ofertas" className="px-seeall" data-reveal>Ver todos os mais vendidos →</a>
              <div className="px-arrows">
                <button className="px-arrowbtn" aria-label="Produtos anteriores" onClick={() => scrollRow(bestRef.current, -1)}>
                  <Icon name="chevronL" />
                </button>
                <button className="px-arrowbtn" aria-label="Próximos produtos" onClick={() => scrollRow(bestRef.current, 1)}>
                  <Icon name="chevronR" />
                </button>
              </div>
            </div>
          </div>
          <div className="px-scroll" ref={bestRef}>
            {bestsellers.map((p) => (
              <article className="px-card px-prod" data-reveal key={p.id}>
                <a href="#produto" className="px-prod__media">
                  {p.badge && (
                    <span className={`px-prod__badge px-prod__badge--${p.badgeTone}`}>{p.badge}</span>
                  )}
                  <Placeholder label={p.name} icon={p.icon} tone={p.tone} />
                </a>
                <h3 className="px-prod__name">
                  <a href="#produto">{p.name}</a>
                </h3>
                <Stars n={p.n} reviews={p.reviews} />
                <div className="px-prod__buy">
                  <div className="px-prod__price">
                    <span className="px-prod__amount">{p.price}</span>
                    <span className="px-prod__install">{p.installment}</span>
                  </div>
                  <button className="px-prod__add" onClick={addToCart} aria-label={`Adicionar ${p.name} ao carrinho`}>
                    <Icon name="plus" size={16} /> Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 8 · OFERTAS DA SEMANA */}
        <section id="ofertas" className="px-section px-section--pad">
          <div className="px-promo" data-reveal>
            <div className="px-promo__glow" aria-hidden="true" />
            <div className="px-promo__copy">
              <span className="px-promo__tag">Ofertas da semana</span>
              <h2 className="px-promo__title">Até 40% de desconto</h2>
              <p className="px-promo__lead">Em papelaria, informática e utilidades.</p>
              <a href="#ofertas" className="px-btn px-btn--red px-promo__btn">
                Ver ofertas <Icon name="arrow" size={17} />
              </a>
            </div>
            <div className="px-promo__media">
              <Placeholder label="Composição de produtos: caderno, canetas, porta-canetas e planta" icon="pencil" tone="blue" />
            </div>
          </div>
        </section>

        {/* 9 · CAMPANHAS */}
        <section className="px-section px-section--pad">
          <div className="px-camps">
            {campaigns.map((c) => (
              <a href="#ofertas" className="px-camp" data-reveal key={c.tag}>
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

        {/* 10 · ATACADO */}
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
                  <a href="#orcamento" className="px-btn px-btn--primary px-btn--sm">Solicitar orçamento</a>
                  <a href="#atacado" className="px-btn px-btn--ghost px-btn--sm">Conhecer o atacado</a>
                </div>
              </div>
              <div className="px-atac__benefits">
                {atacadoBenefits.map((b) => (
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

        {/* 11 · MARCAS */}
        <section className="px-section px-section--pad">
          <div className="px-rowhead px-rowhead--brands">
            <h2 className="px-h2 px-h2--sm" data-reveal>As melhores marcas você encontra aqui</h2>
            <a href="#marcas" className="px-seeall" data-reveal>Ver todas as marcas →</a>
          </div>
          <div className="px-brands" data-reveal>
            {brands.map((b) => (
              <span className="px-brand" key={b}>{b}</span>
            ))}
          </div>
        </section>

        {/* 12 · NEWSLETTER */}
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
              <input
                id="px-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setNewsletterMsg(null); }}
                placeholder="Seu melhor e-mail"
                autoComplete="email"
              />
              <button type="submit">Cadastrar</button>
              {newsletterMsg && (
                <p className="px-news__msg" role="status">{newsletterMsg}</p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* 13 · RODAPÉ */}
      <footer className="px-footer">
        <button className="px-totop" onClick={scrollTop}>
          <Icon name="up" size={16} /> Voltar ao topo
        </button>

        <div className="px-footer__in">
          <div className="px-footer__cols">
            <div>
              <h4>Conheça a Paulex</h4>
              <ul>
                <li><a href="#historia" className="px-foot-link">Nossa história</a></li>
                <li><a href="#carreiras" className="px-foot-link">Trabalhe conosco</a></li>
                <li><a href="#lojas" className="px-foot-link">Lojas físicas</a></li>
                <li><a href="#atacado" className="px-foot-link">Atacado</a></li>
                <li><a href="#trocas" className="px-foot-link">Política de trocas</a></li>
              </ul>
            </div>
            <div>
              <h4>Categorias</h4>
              <ul>
                <li><a href="#universos" className="px-foot-link">Papelaria</a></li>
                <li><a href="#universos" className="px-foot-link">Utilidades</a></li>
                <li><a href="#universos" className="px-foot-link">Brinquedos</a></li>
                <li><a href="#universos" className="px-foot-link">Informática</a></li>
                <li><a href="#universos" className="px-foot-link">Cosméticos</a></li>
                <li><a href="#universos" className="px-foot-link">Descartáveis</a></li>
                <li><a href="#atacado" className="px-foot-link">Atacado</a></li>
              </ul>
            </div>
            <div>
              <h4>Atendimento</h4>
              <ul>
                <li><a href="#ajuda" className="px-foot-link">Fale conosco</a></li>
                <li><a href="#whatsapp" className="px-foot-link">WhatsApp</a></li>
                <li><a href="#entrega" className="px-foot-link">Entrega e retirada</a></li>
                <li><a href="#trocas" className="px-foot-link">Trocas e devoluções</a></li>
                <li><a href="#faq" className="px-foot-link">Perguntas frequentes</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="#privacidade" className="px-foot-link">Política de privacidade</a></li>
                <li><a href="#termos" className="px-foot-link">Termos de uso</a></li>
                <li><a href="#cookies" className="px-foot-link">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4>Redes sociais</h4>
              <ul>
                <li><a href="#instagram" className="px-foot-link px-foot-link--ic"><Icon name="instagram" size={15} />Instagram</a></li>
                <li><a href="#whatsapp" className="px-foot-link px-foot-link--ic"><Icon name="whatsapp" size={15} />WhatsApp</a></li>
                <li><a href="#facebook" className="px-foot-link px-foot-link--ic"><Icon name="facebook" size={15} />Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="px-footer__base">
            <Logo variant="muted" />
            <span className="px-footer__legal">© 2026 Paulex Armarinho LTDA. · CNPJ 59.340.421/0001-04</span>
            <a href="#privacidade" className="px-foot-link">Privacidade</a>
            <a href="#termos" className="px-foot-link">Termos</a>
            <a href="#cookies" className="px-foot-link">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
