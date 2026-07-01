import { useState, type FormEvent } from "react";
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
  const { names: categoryNames } = useCategories();
  const [q, setQ] = useState("");

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
            <span><Icon name="pin" size={14} />Enviamos para todo o Rio de Janeiro</span>
            <span><Icon name="medal" size={14} />Mais de 40 anos de tradição</span>
            <span><Icon name="shield" size={14} />Compra 100% segura</span>
            <span><Icon name="headset" size={14} />Atendimento humano</span>
          </div>
          <div className="px-topbar__right">
            <a href={href("/produtos")} className="px-navlink"><Icon name="store" size={14} />Nossas lojas</a>
            <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-navlink">Ajuda</a>
            <a href={href("/admin")} className="px-navlink">Admin</a>
          </div>
        </div>
      </div>

      {/* 2 · HEADER */}
      <header className="px-sticky">
        <div className="px-header">
          <div className="px-header__in">
            <a href={href("/")} className="px-header__logo" aria-label="Paulex — página inicial">
              <Logo />
            </a>

            <form className="px-search" role="search" onSubmit={onSearch}>
              <label htmlFor="px-q" className="px-sr-only">O que você procura</label>
              <span className="px-search__icon"><Icon name="search" size={19} /></span>
              <input
                id="px-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="O que você precisa hoje?"
                autoComplete="off"
              />
              <label htmlFor="px-cat" className="px-sr-only">Categoria</label>
              <select id="px-cat" defaultValue={ALL} onChange={(e) => onCategory(e.target.value)}>
                <option>{ALL}</option>
                {categoryNames.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button type="submit">
                Buscar <Icon name="search" size={16} />
              </button>
            </form>

            <div className="px-acctbar">
              <a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-acct">
                <Icon name="user" size={22} />
                <span className="px-acct__txt">
                  <span className="px-acct__title">Entrar</span>
                  <span className="px-acct__sub">Minha conta</span>
                </span>
              </a>
              <a href={href("/favoritos")} className="px-acct">
                <span className="px-acct__cart">
                  <Icon name="heart" size={22} />
                  {favCount > 0 && <span className="px-acct__badge" aria-hidden="true">{favCount}</span>}
                </span>
                <span className="px-acct__txt">
                  <span className="px-acct__title">Favoritos</span>
                  <span className="px-acct__sub">{favCount} {favCount === 1 ? "item" : "itens"}</span>
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
                  <span className="px-acct__sub">{count} {count === 1 ? "item" : "itens"}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
