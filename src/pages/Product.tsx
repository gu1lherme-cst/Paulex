import { useState } from "react";
import { Icon } from "../components/Icon";
import { Placeholder } from "../components/Placeholder";
import { Stars } from "../components/Stars";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/cart";
import { href } from "../lib/router";
import {
  productById, relatedProducts, discountPercent, productDescription, categorySlug,
} from "../data/catalog";

export function Product({ id }: { id: string }) {
  const product = productById(id);
  const { add, buyNow, fulfillment, setFulfillment } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="px-section px-listing" id="topo">
        <div className="px-empty">
          <span className="px-empty__icon"><Icon name="search" size={30} /></span>
          <p>Produto não encontrado.</p>
          <a href={href("/produtos")} className="px-btn px-btn--primary px-btn--sm">Ver todos os produtos</a>
        </div>
      </main>
    );
  }

  const pct = discountPercent(product);
  const related = relatedProducts(product, 4);
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  return (
    <main className="px-section px-pdp" id="topo">
      <nav className="px-crumb" aria-label="Você está em">
        <a href={href("/")}>Início</a>
        <Icon name="chevronR" size={13} />
        <a href={href(`/categoria/${categorySlug(product.category)}`)}>{product.category}</a>
        <Icon name="chevronR" size={13} />
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="px-pdp__grid">
        <div className="px-pdp__gallery">
          {pct > 0 && <span className="px-pdp__badge">-{pct}%</span>}
          <Placeholder label={product.name} icon={product.icon} tone={product.tone} />
        </div>

        <div className="px-pdp__info">
          <p className="px-pdp__cat">{product.category}</p>
          <h1 className="px-pdp__title">{product.name}</h1>
          <Stars n={product.n} reviews={product.reviews} />

          <div className="px-pdp__pricing">
            {product.oldPrice && <span className="px-pdp__old">{product.oldPrice}</span>}
            <span className="px-pdp__price">{product.price}</span>
            <span className="px-pdp__install">{product.installment}</span>
          </div>

          <div className="px-pdp__buy">
            <div className="px-qty" role="group" aria-label="Quantidade">
              <button type="button" onClick={dec} disabled={qty <= 1} aria-label="Diminuir quantidade"><Icon name="minus" size={16} /></button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={inc} aria-label="Aumentar quantidade"><Icon name="plus" size={16} /></button>
            </div>
            <button className="px-btn px-btn--primary px-pdp__add" onClick={() => add(product.id, qty)}>
              <Icon name="cart" size={18} /> Adicionar ao carrinho
            </button>
            <button className="px-btn px-btn--red px-pdp__now" onClick={() => buyNow(product.id, qty)}>
              Comprar agora
            </button>
          </div>

          <div className="px-pdp__fulfill">
            {(["retirada", "entrega"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                className={`px-ffcard${fulfillment === opt ? " px-ffcard--on" : ""}`}
                aria-pressed={fulfillment === opt}
                onClick={() => setFulfillment(opt)}
              >
                <span className="px-ffcard__icon"><Icon name={opt === "retirada" ? "store" : "truck"} size={20} /></span>
                <span>
                  <strong>{opt === "retirada" ? "Retirada na loja" : "Entrega local"}</strong>
                  <small>{opt === "retirada" ? "Retire sem custo na Paulex" : "Para todo o Rio de Janeiro"}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="px-pdp__trust">
            <span><Icon name="shield" size={16} />Compra 100% segura</span>
            <span><Icon name="headset" size={16} />Atendimento humano</span>
          </div>

          <p className="px-pdp__desc">{productDescription(product)}</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="px-pdp__related">
          <h2 className="px-h2 px-h2--sm" data-reveal>Produtos relacionados</h2>
          <div className="px-grid">
            {related.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
