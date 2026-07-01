import { Icon } from "./Icon";
import { Placeholder } from "./Placeholder";
import { Stars } from "./Stars";
import { useCart } from "../lib/cart";
import { useWishlist } from "../lib/wishlist";
import { href } from "../lib/router";
import { discountPercent, stockLevel, type Product } from "../data/catalog";

export function ProductCard({ p }: { p: Product }) {
  const { add, buyNow } = useCart();
  const { has, toggle } = useWishlist();
  const pct = discountPercent(p);
  const level = stockLevel(p);
  const out = level === "out";
  const fav = has(p.id);
  const link = href(`/produto/${p.id}`);

  return (
    <article className="px-card px-prod" data-reveal>
      <div className="px-prod__media">
        {pct > 0 && <span className="px-prod__badge">-{pct}%</span>}
        <button
          type="button"
          className={`px-fav${fav ? " px-fav--on" : ""}`}
          aria-pressed={fav}
          aria-label={fav ? `Remover ${p.name} dos favoritos` : `Adicionar ${p.name} aos favoritos`}
          onClick={() => toggle(p.id)}
        >
          <Icon name="heart" size={18} />
        </button>
        <a href={link} className="px-prod__medialink" aria-label={p.name}>
          <Placeholder label={p.name} icon={p.icon} tone={p.tone} imageUrl={p.imageUrl} />
        </a>
        {out && <span className="px-prod__out">Esgotado</span>}
      </div>
      <h3 className="px-prod__name">
        <a href={link}>{p.name}</a>
      </h3>
      <Stars n={p.n} reviews={p.reviews} />
      {level === "low" && <p className="px-prod__stock">Últimas {p.stock} unidades</p>}
      <div className="px-prod__foot">
        <div className="px-prod__price">
          {p.oldPrice && <span className="px-prod__old">{p.oldPrice}</span>}
          <span className="px-prod__amount">{p.price}</span>
          <span className="px-prod__install">{p.installment}</span>
        </div>
        <div className="px-prod__actions">
          <button
            className="px-prod__add"
            onClick={() => add(p.id)}
            disabled={out}
            aria-label={out ? `${p.name} esgotado` : `Adicionar ${p.name} ao carrinho`}
          >
            <Icon name="cart" size={16} /> {out ? "Esgotado" : "Adicionar ao carrinho"}
          </button>
          <button
            className="px-prod__now"
            onClick={() => buyNow(p.id)}
            disabled={out}
            aria-label={`Comprar ${p.name} agora`}
          >
            Comprar agora
          </button>
        </div>
      </div>
    </article>
  );
}
