import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CUPONS, FRETE_GRATIS_MIN } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { ProductMedia } from "../components/ProductMedia";
import { Icon, ICONS } from "../components/Icon";
import { money, plural } from "../lib/format";
import { cartTotals, unitPrice } from "../lib/pricing";

export function Carrinho() {
  const navigate = useNavigate();
  const { products, cart, cupom, setCartQty, clearCart, applyCupom, removeCupom } = useStore();
  const { toast } = useToast();
  const [code, setCode] = useState("");

  const entries = Object.entries(cart).filter(([id]) =>
    products.some((p) => p.id === id),
  );
  const vazio = entries.length === 0;
  const t = cartTotals(cart, products, cupom);
  const temCupom = Boolean(CUPONS[cupom]);
  const gratis = t.total >= FRETE_GRATIS_MIN;
  const falta = FRETE_GRATIS_MIN - t.total;

  const handleClear = () => {
    if (vazio) return;
    if (confirm("Esvaziar o carrinho?")) clearCart();
  };

  const handleCupom = () => {
    if (!code.trim()) return;
    if (applyCupom(code)) {
      toast(`Cupom ${code.toUpperCase()} aplicado!`);
      setCode("");
    } else {
      toast("Cupom inválido ou expirado");
    }
  };

  return (
    <section className="screen active">
      <TopBar
        title="Carrinho"
        right={
          <button className="link" onClick={handleClear}>
            Limpar
          </button>
        }
      />

      <div className="wrap cart-wrap">
        {vazio ? (
          <div className="cart-empty">
            <span className="empty-ico">
              <Icon path={ICONS.cart} />
            </span>
            <p>Seu carrinho está vazio.</p>
            <button className="pill pill-blue" onClick={() => navigate("/")}>
              Ver produtos
            </button>
          </div>
        ) : (
          <>
            <div>
              {entries.map(([id, qty]) => {
                const p = products.find((x) => x.id === id)!;
                const unit = unitPrice(p, qty);
                const atacado = unit < p.preco - 0.005;
                return (
                  <div className="cart-item" key={id}>
                    <div className="ph">
                      <ProductMedia p={p} />
                    </div>
                    <div className="info">
                      <strong>{p.nome}</strong>
                      <small>
                        {plural(qty, "unidade", "unidades")} · {money(unit)} cada
                        {atacado && <span className="atacado-tag">atacado</span>}
                      </small>
                    </div>
                    <div className="stepper">
                      <button onClick={() => setCartQty(id, -1)} aria-label="Diminuir">−</button>
                      <output>{qty}</output>
                      <button onClick={() => setCartQty(id, 1)} aria-label="Aumentar">+</button>
                    </div>
                    <div className="line-price">{money(unit * qty)}</div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="ship-progress">
                <small className={gratis ? "done" : ""}>
                  {gratis
                    ? "Você ganhou frete grátis!"
                    : `Faltam ${money(falta)} para o frete grátis`}
                </small>
                <div className="ship-bar">
                  <span
                    className={gratis ? "done" : ""}
                    style={{ width: `${Math.min(100, (t.total / FRETE_GRATIS_MIN) * 100)}%` }}
                  />
                </div>
              </div>

              {temCupom ? (
                <div className="row">
                  <span>
                    Cupom <strong>{cupom}</strong> ({CUPONS[cupom].descricao}){" "}
                    <button className="coupon-remove" onClick={removeCupom}>
                      remover
                    </button>
                  </span>
                  <span className="red">-{money(t.cupomVal)}</span>
                </div>
              ) : (
                <div className="coupon-form">
                  <input
                    value={code}
                    placeholder="Tem um cupom?"
                    autoComplete="off"
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCupom()}
                  />
                  <button className="pill pill-outline" onClick={handleCupom}>
                    Aplicar
                  </button>
                </div>
              )}

              <div className="row">
                <span>Subtotal ({plural(t.itens, "item", "itens")})</span>
                <span>{money(t.cheio)}</span>
              </div>
              {t.desconto > 0.005 && (
                <div className="row">
                  <span>Desconto por quantidade</span>
                  <span className="red">-{money(t.desconto)}</span>
                </div>
              )}
              <div className="row">
                <span>Frete</span>
                <span className={gratis ? "green" : "muted"}>
                  {gratis ? "Grátis" : "A calcular"}
                </span>
              </div>
              <div className="row total">
                <span>Total</span>
                <strong>{money(t.total)}</strong>
              </div>

              <button className="pill pill-blue pill-lg" onClick={() => navigate("/checkout")}>
                Ir para o pagamento
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
