import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { useCart } from "../lib/cart";
import { useWishlist } from "../lib/wishlist";
import { useCategories } from "../lib/categories";
import { navigate, href } from "../lib/router";
import { categorySlug } from "../data/catalog";
import { WHATSAPP_CONTACT } from "../lib/format";

const ALL = "Todas as categorias";

export function Header() {
  const { count, open } = useCart();
  const { count: favCount } = useWishlist();
  const { categories, names: categoryNames } = useCategories();
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  /* Blur/sombra suave no header fixo ao rolar (só visual). */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/busca/${encodeURIComponent(term)}` : "/produtos");
  };

  const onCategory = (value: string) => {
    navigate(value === ALL ? "/produtos" : `/categoria/${categorySlug(value)}`);
  };

  return (
    <>
      {/* 1 · TOP BAR */}
      <div className="px-topbar">
        <div className="px-topbar__in">
          <div className="px-topbar__left">
            <span><Icon name="pin" size={14} />Entregar em: Rio de Janeiro - RJ</span>
          </div>
          <div className="px-topbar__right">
            <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-navlink"><Icon name="whatsapp" size={14} />Atendimento</a>
            <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-navlink">Acompanhar pedido</a>
            <a href={href("/admin")} className="px-navlink">Admin</a>
          </div>
        </div>
      </div>

      {/* 2 · HEADER + BARRA DE CATEGORIAS (fixos) */}
      <header className={`px-sticky${scrolled ? " px-sticky--scrolled" : ""}`}>
        <div className="px-header">
          <div className="px-header__in">
            <a href={href("/")} className="px-header__logo" aria-label="Paulex — página inicial">
              <Logo />
            </a>

            <form className="px-search" role="search" onSubmit={onSearch}>
              <label htmlFor="px-q" className="px-sr-only">O que você procura</label>
              <input
                id="px-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="O que você procura hoje?"
                autoComplete="off"
              />
              <label htmlFor="px-cat" className="px-sr-only">Categoria</label>
              <select id="px-cat" defaultValue={ALL} onChange={(e) => onCategory(e.target.value)}>
                <option>{ALL}</option>
                {categoryNames.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button type="submit" aria-label="Buscar">
                <Icon name="search" size={20} />
              </button>
            </form>

            <div className="px-acctbar">
              <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-acct">
                <Icon name="user" size={22} />
                <span className="px-acct__txt">
                  <span className="px-acct__sub">Olá, faça seu</span>
                  <span className="px-acct__title">Entrar</span>
                </span>
              </a>
              <a href={href("/favoritos")} className="px-acct">
                <span className="px-acct__cart">
                  <Icon name="heart" size={22} />
                  {favCount > 0 && <span className="px-acct__badge" aria-hidden="true">{favCount}</span>}
                </span>
                <span className="px-acct__txt">
                  <span className="px-acct__title">Favoritos</span>
                </span>
              </a>
              <button
                type="button"
                className="px-acct"
                data-cart-trigger
                onClick={open}
                aria-label={`Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
              >
                <span className="px-acct__cart">
                  <Icon name="cart" size={23} />
                  {count > 0 && <span className="px-acct__badge" aria-hidden="true">{count}</span>}
                </span>
                <span className="px-acct__txt">
                  <span className="px-acct__title">Carrinho</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 · BARRA DE CATEGORIAS */}
        <nav className="px-catbar" aria-label="Categorias">
          <div className="px-catbar__in">
            <a href={href("/produtos")} className="px-catbar__all">
              <Icon name="list" size={17} />
              Todas as categorias
            </a>
            {categories.slice(0, 5).map((c) => (
              <a key={c.slug} href={href(`/categoria/${c.slug}`)} className="px-catbar__link">
                {c.name}
              </a>
            ))}
            <span className="px-catbar__sep" aria-hidden="true" />
            <a href={href("/ofertas")} className="px-catbar__link px-catbar__link--hot">Ofertas</a>
            <a href={href("/produtos")} className="px-catbar__link">Novidades</a>
          </div>
        </nav>
      </header>
    </>
  );
}
