import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { ProductMedia } from "../components/ProductMedia";
import { ProductCard } from "../components/ProductCard";
import { Icon, ICONS } from "../components/Icon";
import { money, num, plural } from "../lib/format";
import { priceTiers, unitPrice } from "../lib/pricing";
import { track } from "../lib/whatsapp";

function ReviewBars({ rating }: { rating: number }) {
  const pesos = [
    Math.max(0.02, (rating - 3) / 2),
    Math.max(0.05, (rating - 2.5) / 4),
    Math.max(0.005, 0.12 - (rating - 4) * 0.06),
    Math.max(0.005, 0.06 - (rating - 4) * 0.04),
    Math.max(0.005, 0.04 - (rating - 4) * 0.03),
  ];
  const total = pesos.reduce((a, b) => a + b, 0);
  return (
    <div className="rev-bars">
      {pesos.map((w, i) => {
        const pct = Math.round((w / total) * 100);
        return (
          <div className="rev-row" key={i}>
            <span>{5 - i}★</span>
            <div className="rev-bar">
              <span style={{ width: `${pct}%` }} />
            </div>
            <small>{pct}%</small>
          </div>
        );
      })}
    </div>
  );
}

export function Produto() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { products, favs, toggleFav, addToCart, pushRecent } = useStore();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  const p = products.find((x) => x.id === id);

  useEffect(() => {
    setQty(1);
    if (p) pushRecent(p.id);
  }, [id, p, pushRecent]);

  const related = useMemo(
    () => (p ? products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4) : []),
    [p, products],
  );

  if (!p) {
    return (
      <section className="screen active">
        <TopBar title="Produto" />
        <div className="wrap">
          <p className="empty">Produto não encontrado.</p>
        </div>
      </section>
    );
  }

  const full = Math.round(p.rating);
  const unit = unitPrice(p, qty);
  const total = unit * qty;
  const economia = (p.preco - unit) * qty;
  const isFav = favs.has(p.id);

  const changeQty = (d: number) =>
    setQty((q) => Math.max(1, Math.min(p.estoque, q + d)));

  const add = () => {
    addToCart(p.id, qty);
    track("add_to_cart", { item: p.id, quantity: qty });
    toast("Adicionado ao carrinho ✓");
  };
  const buy = () => {
    addToCart(p.id, qty);
    navigate("/carrinho");
  };

  return (
    <section className="screen active">
      <TopBar
        title=""
        right={
          <button
            className={"icon-btn" + (isFav ? " fav-on" : "")}
            aria-label="Favoritar"
            onClick={() => toast(toggleFav(p.id) ? "Salvo nos favoritos ❤" : "Removido dos favoritos")}
          >
            <Icon path={ICONS.heart} />
          </button>
        }
      />

      <div className="wrap p-wrap">
        <div className="p-photo">
          <ProductMedia p={p} />
        </div>

        <div className="p-body">
          <h2>{p.nome}</h2>
          <small className="muted">{p.unidade}</small>
          <div className="stars">
            {"★".repeat(full)}
            {"☆".repeat(5 - full)}{" "}
            <small>
              {p.rating.toFixed(1)} ({num(p.avaliacoes)} avaliações)
            </small>
          </div>
          <div className={"p-price" + (p.precoAntigo ? " red" : "")}>
            {money(p.preco)}
            {p.precoAntigo && <small>{money(p.precoAntigo)}</small>}
          </div>
          <div className="stock">
            ● Em estoque <span>· {p.estoque} unidades disponíveis</span>
          </div>
          <p className="p-desc">{p.desc}</p>

          <div className="tiers">
            <strong className="red">Preço de atacado a partir de 12 peças</strong>
            <table>
              <thead>
                <tr>
                  <th>Quantidade</th>
                  <th>Preço unitário</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {priceTiers(p).map((t, i) => (
                  <tr key={i}>
                    <td>{t.faixa}</td>
                    <td>{money(t.preco)}</td>
                    <td className="off">{t.off || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="qty-row">
            <span>Quantidade</span>
            <div className="stepper">
              <button onClick={() => changeQty(-1)} aria-label="Diminuir">−</button>
              <output>{qty}</output>
              <button onClick={() => changeQty(1)} aria-label="Aumentar">+</button>
            </div>
          </div>
          <div className="qty-total">
            <span>Total ({plural(qty, "unidade", "unidades")})</span>
            <div>
              <strong>{money(total)}</strong>
              {economia > 0.005 && <small className="green">Economize {money(economia)}</small>}
            </div>
          </div>

          <div className="p-actions">
            <button className="pill pill-outline" onClick={add}>Adicionar ao carrinho</button>
            <button className="pill pill-blue" onClick={buy}>Comprar agora</button>
          </div>

          <div className="p-specs">
            <h3>Especificações</h3>
            <dl>
              {p.specs.map(([k, v]) => (
                <div className="spec" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="p-reviews">
            <h3>Avaliações</h3>
            <div className="rev-summary">
              <div className="rev-score">
                <strong>{p.rating.toFixed(1).replace(".", ",")}</strong>
                <span className="stars">
                  {"★".repeat(full)}
                  {"☆".repeat(5 - full)}
                </span>
                <small className="muted">{num(p.avaliacoes)} avaliações</small>
              </div>
              <ReviewBars rating={p.rating} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="wrap p-related-wrap">
          <h3 className="rel-title">Você também pode gostar</h3>
          <div className="product-grid">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
