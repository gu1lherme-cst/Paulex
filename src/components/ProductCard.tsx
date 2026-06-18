import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { money } from "../lib/format";
import { atacadoOff } from "../lib/pricing";
import { ProductMedia } from "./ProductMedia";
import { Icon, ICONS } from "./Icon";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { track } from "../lib/whatsapp";
import { FRETE_GRATIS_MIN } from "../data/catalog";

export function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate();
  const { addToCart, favs, toggleFav } = useStore();
  const { toast } = useToast();

  const open = () => navigate(`/produto/${p.id}`);
  const isFav = favs.has(p.id);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p.id, 1);
    track("add_to_cart", { item: p.id });
    toast("Adicionado ao carrinho ✓");
  };

  const fav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast(toggleFav(p.id) ? "Salvo nos favoritos ❤" : "Removido dos favoritos");
  };

  const desconto = p.precoAntigo
    ? Math.round((1 - p.preco / p.precoAntigo) * 100)
    : 0;
  const full = Math.round(p.rating);

  return (
    <article
      className="card"
      role="button"
      tabIndex={0}
      aria-label={`${p.nome} — ${money(p.preco)}`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="ph">
        <div className="card-flags">
          {p.promo && <span className="tag">OFERTA</span>}
          {!p.promo && p.novidade && <span className="tag new">NOVO</span>}
          {desconto > 0 && <span className="tag off">-{desconto}%</span>}
        </div>
        <button
          className={"card-fav" + (isFav ? " on" : "")}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={isFav}
          onClick={fav}
        >
          <Icon path={ICONS.heart} size={18} />
        </button>
        <ProductMedia p={p} />
      </div>
      <div className="info">
        <span className="name">{p.nome}</span>
        <span className="card-rating" aria-label={`Nota ${p.rating.toFixed(1)} de 5`}>
          <span className="stars" aria-hidden="true">
            {"★".repeat(full)}
            {"☆".repeat(5 - full)}
          </span>
          <small>{p.avaliacoes.toLocaleString("pt-BR")}</small>
        </span>
        <span className="card-prices">
          {p.precoAntigo && <span className="old">{money(p.precoAntigo)}</span>}
          <span className={"price" + (p.precoAntigo ? " red" : "")}>{money(p.preco)}</span>
        </span>
        <span className="card-meta">
          {p.preco >= FRETE_GRATIS_MIN ? (
            <span className="ship-free">
              <Icon path={ICONS.truck} size={14} /> Frete grátis
            </span>
          ) : (
            <span className="muted small">Atacado −{atacadoOff(p)}% (12+)</span>
          )}
        </span>
        <button
          className="add"
          aria-label={`Adicionar ${p.nome} ao carrinho`}
          onClick={quickAdd}
        >
          <Icon path={ICONS.cart} size={18} /> Adicionar
        </button>
      </div>
    </article>
  );
}
