import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Placeholder } from "./Placeholder";
import { useCart } from "../lib/cart";
import { formatBRL, waLink } from "../lib/format";

const FULFILLMENT = {
  retirada: { label: "Retirar na loja", line: "Retirada na loja" },
  entrega: { label: "Entrega local", line: "Entrega local (combinar frete pelo WhatsApp)" },
} as const;

export function CartDrawer() {
  const {
    lines, count, subtotal, discount, total, isOpen, close, inc, dec, remove,
    fulfillment, setFulfillment, couponCode, couponLabel, applyCoupon, removeCoupon,
    customer, setCustomer,
  } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.querySelector<HTMLElement>("[data-cart-trigger]")?.focus();
    };
  }, [isOpen, close]);

  const onApplyCoupon = () => {
    const ok = applyCoupon(couponInput);
    setCouponMsg(ok ? "Cupom aplicado!" : "Cupom inválido.");
    if (ok) setCouponInput("");
  };

  const checkout = () => {
    if (lines.length === 0) return;
    const itens = lines
      .map((it) => {
        const tag = it.wholesaleApplied ? " (atacado)" : "";
        return `• ${it.name}\n   ${it.qty} × ${formatBRL(it.unit)}${tag} = ${formatBRL(it.lineTotal)}`;
      })
      .join("\n");
    let msg = `Olá, gostaria de finalizar este pedido.\n\n${itens}\n\nSubtotal: ${formatBRL(subtotal)}`;
    if (couponCode) msg += `\nCupom ${couponCode}: -${formatBRL(discount)}`;
    msg += `\nTotal: ${formatBRL(total)}\n\nEntrega: ${FULFILLMENT[fulfillment].line}`;
    if (customer.name.trim()) msg += `\nNome: ${customer.name.trim()}`;
    if (customer.phone.trim()) msg += `\nTelefone: ${customer.phone.trim()}`;
    window.open(waLink(msg), "_blank", "noopener");
  };

  return (
    <>
      <div className={`px-overlay${isOpen ? " px-overlay--on" : ""}`} onClick={close} aria-hidden="true" />
      <aside
        className={`px-drawer${isOpen ? " px-drawer--open" : ""}`}
        role="dialog" aria-label="Carrinho de compras" aria-modal="true" aria-hidden={!isOpen}
      >
        <div className="px-drawer__head">
          <h2 className="px-drawer__title">
            <Icon name="cart" size={20} /> Seu carrinho
            {count > 0 && <span className="px-drawer__count">{count}</span>}
          </h2>
          <button type="button" className="px-drawer__close" ref={closeRef} onClick={close} aria-label="Fechar carrinho">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="px-drawer__empty">
            <span className="px-drawer__emptyicon"><Icon name="cart" size={34} /></span>
            <p>Seu carrinho está vazio.</p>
            <button type="button" className="px-btn px-btn--primary px-btn--sm" onClick={close}>Continuar comprando</button>
          </div>
        ) : (
          <>
            <div className="px-drawer__list">
              {lines.map((it) => (
                <div className="px-citem" key={it.id}>
                  <div className="px-citem__media">
                    <Placeholder label={it.name} icon={it.icon} tone={it.tone} />
                  </div>
                  <div className="px-citem__info">
                    <p className="px-citem__name">{it.name}</p>
                    <p className="px-citem__unit">
                      {formatBRL(it.unit)}
                      {it.wholesaleApplied && <span className="px-citem__wholesale">atacado</span>}
                    </p>
                    <div className="px-citem__qty">
                      <button type="button" onClick={() => dec(it.id)} disabled={it.qty <= 1} aria-label={`Diminuir quantidade de ${it.name}`}>
                        <Icon name="minus" size={14} />
                      </button>
                      <span aria-live="polite">{it.qty}</span>
                      <button type="button" onClick={() => inc(it.id)} disabled={it.qty >= it.stock} aria-label={`Aumentar quantidade de ${it.name}`}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="px-citem__right">
                    <button type="button" className="px-citem__rm" onClick={() => remove(it.id)} aria-label={`Remover ${it.name} do carrinho`}>
                      <Icon name="trash" size={17} />
                    </button>
                    <span className="px-citem__line">{formatBRL(it.lineTotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-drawer__foot">
              <fieldset className="px-fulfill">
                <legend className="px-sr-only">Forma de entrega</legend>
                {(["retirada", "entrega"] as const).map((opt) => (
                  <button
                    key={opt} type="button"
                    className={`px-fulfill__opt${fulfillment === opt ? " px-fulfill__opt--on" : ""}`}
                    aria-pressed={fulfillment === opt} onClick={() => setFulfillment(opt)}
                  >
                    <Icon name={opt === "retirada" ? "store" : "truck"} size={18} />
                    {FULFILLMENT[opt].label}
                  </button>
                ))}
              </fieldset>

              {couponCode ? (
                <div className="px-coupon px-coupon--on">
                  <span><Icon name="tag" size={15} /> Cupom <strong>{couponCode}</strong> — {couponLabel}</span>
                  <button type="button" onClick={() => { removeCoupon(); setCouponMsg(null); }}>Remover</button>
                </div>
              ) : (
                <div className="px-coupon">
                  <input
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponMsg(null); }}
                    placeholder="Cupom de desconto"
                    aria-label="Cupom de desconto"
                  />
                  <button type="button" onClick={onApplyCoupon}>Aplicar</button>
                </div>
              )}
              {couponMsg && <p className="px-coupon__msg" role="status">{couponMsg}</p>}

              <div className="px-customer">
                <label className="px-sr-only" htmlFor="px-cust-name">Seu nome</label>
                <input id="px-cust-name" value={customer.name} onChange={(e) => setCustomer({ name: e.target.value })} placeholder="Seu nome (opcional)" autoComplete="name" />
                <label className="px-sr-only" htmlFor="px-cust-phone">Seu telefone</label>
                <input id="px-cust-phone" value={customer.phone} onChange={(e) => setCustomer({ phone: e.target.value })} placeholder="Telefone (opcional)" inputMode="tel" autoComplete="tel" />
              </div>

              <div className="px-drawer__sum"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
              {discount > 0 && (
                <div className="px-drawer__sum px-drawer__sum--disc"><span>Desconto</span><span>- {formatBRL(discount)}</span></div>
              )}
              <div className="px-drawer__sum px-drawer__sum--total"><span>Total</span><span>{formatBRL(total)}</span></div>

              <button type="button" className="px-drawer__checkout" onClick={checkout}>
                <Icon name="whatsapp" size={18} /> Finalizar pedido
              </button>
              <button type="button" className="px-drawer__cont" onClick={close}>Continuar comprando</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
