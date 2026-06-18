import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { money } from "../lib/format";
import { ProductMedia } from "./ProductMedia";
import { Icon, ICONS } from "./Icon";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { track } from "../lib/whatsapp";

export function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const { toast } = useToast();

  const open = () => navigate(`/produto/${p.id}`);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p.id, 1);
    track("add_to_cart", { item: p.id });
    toast("Adicionado ao carrinho ✓");
  };

  const tag = p.promo ? (
    <span className="tag">OFERTA</span>
  ) : p.novidade ? (
    <span className="tag new">NOVO</span>
  ) : null;

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="ph">
        {tag}
        <ProductMedia p={p} />
      </div>
      <div className="info">
        <span className="name">{p.nome}</span>
        {p.precoAntigo && <span className="old">{money(p.precoAntigo)}</span>}
        <span className={"price" + (p.precoAntigo ? " red" : "")}>
          {money(p.preco)}
        </span>
        <button
          className="add"
          aria-label={`Adicionar ${p.nome} ao carrinho`}
          onClick={quickAdd}
        >
          <Icon path={ICONS.cart} size={18} /> Adicionar
        </button>
      </div>
    </div>
  );
}
