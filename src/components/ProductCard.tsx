import { Icon } from "./Icon";
import { Placeholder } from "./Placeholder";
import { Stars } from "./Stars";
import { useCart } from "../lib/cart";
import { href } from "../lib/router";
import { discountPercent, type Product } from "../data/catalog";

export function ProductCard({ p }: { p: Product }) {
  const { add, buyNow } = useCart();
  const pct = discountPercent(p);
  const link = href(`/produto/${p.id}`);

  return (
    <article className="px-card px-prod" data-reveal>
      <a href={link} className="px-prod__media" aria-label={p.name}>
        {pct > 0 && <span className="px-prod__badge">-{pct}%</span>}
        <Placeholder label={p.name} icon={p.icon} tone={p.tone} />
      </a>
      <h3 className="px-prod__name">
        <a href={link}>{p.name}</a>
      </h3>
      <Stars n={p.n} reviews={p.reviews} />
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
            aria-label={`Adicionar ${p.name} ao carrinho`}
          >
            <Icon name="cart" size={16} /> Adicionar ao carrinho
          </button>
          <button
            className="px-prod__now"
            onClick={() => buyNow(p.id)}
            aria-label={`Comprar ${p.name} agora`}
          >
            Comprar agora
          </button>
        </div>
      </div>
    </article>
  );
}
