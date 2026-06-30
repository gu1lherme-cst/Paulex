import { Icon } from "../components/Icon";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "../lib/wishlist";
import { href } from "../lib/router";

export function Favorites() {
  const { items } = useWishlist();

  return (
    <main className="px-section px-listing" id="topo">
      <nav className="px-crumb" aria-label="Você está em">
        <a href={href("/")}>Início</a>
        <Icon name="chevronR" size={13} />
        <span aria-current="page">Favoritos</span>
      </nav>

      <div className="px-listing__head">
        <div>
          <h1 className="px-listing__title">Meus favoritos</h1>
          <p className="px-listing__count">
            {items.length} {items.length === 1 ? "produto" : "produtos"}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-empty">
          <span className="px-empty__icon"><Icon name="heart" size={28} /></span>
          <p>Você ainda não favoritou nenhum produto.</p>
          <a href={href("/produtos")} className="px-btn px-btn--primary px-btn--sm">Ver produtos</a>
        </div>
      ) : (
        <div className="px-grid">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
