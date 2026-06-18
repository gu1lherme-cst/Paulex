import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CUPONS } from "../data/catalog";
import { useStore, nextOrderNumber, orderItemsFromCart } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import { money, plural } from "../lib/format";
import { cartTotals } from "../lib/pricing";
import { openWhatsApp, track } from "../lib/whatsapp";
import {
  createOnlineCheckout,
  isOnlinePaymentEnabled,
} from "../lib/payments";
import type { Order } from "../types";

type Metodo = "pix" | "cartao" | "whatsapp";

export function Checkout() {
  const navigate = useNavigate();
  const { products, cart, cupom, orders, placeOrder } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();
  const online = isOnlinePaymentEnabled();
  const [metodo, setMetodo] = useState<Metodo>(online ? "pix" : "whatsapp");
  const [busy, setBusy] = useState(false);

  const entries = Object.entries(cart).filter(([id]) =>
    products.some((p) => p.id === id),
  );
  const t = cartTotals(cart, products, cupom);

  if (entries.length === 0) {
    return (
      <section className="screen active">
        <TopBar title="Pagamento" />
        <div className="wrap">
          <p className="empty">Seu carrinho está vazio.</p>
          <button className="pill pill-blue" onClick={() => navigate("/")}>
            Ver produtos
          </button>
        </div>
      </section>
    );
  }

  const buildOrder = (pagamento: Order["pagamento"]): Order => ({
    numero: nextOrderNumber(orders),
    data: new Date().toLocaleDateString("pt-BR"),
    status: pagamento === "whatsapp" ? "aguardando" : "pago",
    total: t.total,
    itens: orderItemsFromCart(cart, products),
    pagamento,
    cliente: user ? { nome: user.nome, email: user.email } : undefined,
  });

  const finalizarWhatsApp = () => {
    const order = buildOrder("whatsapp");
    const linhas = order.itens.map((i) => `• ${i.qty}x ${i.nome} — ${money(i.valor)}`);
    const cupomLinha = CUPONS[cupom]
      ? `\nCupom ${cupom} (${CUPONS[cupom].descricao}): -${money(t.cupomVal)}`
      : "";
    const msg = `Olá, Paulex! Quero fazer um pedido:\n\n${linhas.join("\n")}${cupomLinha}\n\nTotal: ${money(t.total)}\n\nPedido nº ${order.numero}`;
    placeOrder(order);
    track("checkout", { value: t.total, pedido: order.numero, metodo: "whatsapp" });
    openWhatsApp(msg);
    toast(`Pedido #${order.numero} registrado!`);
    navigate("/pedidos");
  };

  const finalizarOnline = async () => {
    const order = buildOrder(metodo === "pix" ? "pix" : "cartao");
    setBusy(true);
    try {
      const { url } = await createOnlineCheckout(order);
      placeOrder(order);
      track("checkout", { value: t.total, pedido: order.numero, metodo });
      window.location.href = url;
    } catch {
      toast("Não foi possível iniciar o pagamento online. Tente pelo WhatsApp.");
      setMetodo("whatsapp");
    } finally {
      setBusy(false);
    }
  };

  const finalizar = () => (metodo === "whatsapp" ? finalizarWhatsApp() : finalizarOnline());

  return (
    <section className="screen active">
      <TopBar title="Pagamento" showCart={false} />
      <div className="wrap narrow">
        <h3 className="sec-title">Resumo</h3>
        <div className="cart-summary">
          {entries.map(([id, qty]) => {
            const p = products.find((x) => x.id === id)!;
            return (
              <div className="row" key={id}>
                <span>
                  {qty}x {p.nome}
                </span>
                <span>{money(p.preco * qty)}</span>
              </div>
            );
          })}
          {t.desconto > 0.005 && (
            <div className="row">
              <span>Descontos</span>
              <span className="red">-{money(t.desconto + t.cupomVal)}</span>
            </div>
          )}
          <div className="row total">
            <span>Total ({plural(t.itens, "item", "itens")})</span>
            <strong>{money(t.total)}</strong>
          </div>
        </div>

        <h3 className="sec-title" style={{ marginTop: 24 }}>
          Forma de pagamento
        </h3>

        {!online && (
          <p className="store-note">
            Pagamento online (Pix e cartão) fica disponível assim que as chaves
            do provedor forem configuradas. Por enquanto, finalize pelo WhatsApp
            — rápido e sem custo.
          </p>
        )}

        <div className="pay-methods">
          {online && (
            <>
              <button
                className={"pay-method" + (metodo === "pix" ? " on" : "")}
                onClick={() => setMetodo("pix")}
              >
                <Icon path={ICONS.tag} />
                <div>
                  <strong>Pix</strong>
                  <small>Aprovação na hora</small>
                </div>
              </button>
              <button
                className={"pay-method" + (metodo === "cartao" ? " on" : "")}
                onClick={() => setMetodo("cartao")}
              >
                <Icon path={ICONS.card} />
                <div>
                  <strong>Cartão de crédito</strong>
                  <small>Em até 12x</small>
                </div>
              </button>
            </>
          )}
          <button
            className={"pay-method" + (metodo === "whatsapp" ? " on" : "")}
            onClick={() => setMetodo("whatsapp")}
          >
            <Icon path={ICONS.whatsapp} />
            <div>
              <strong>WhatsApp</strong>
              <small>Combine pagamento e entrega no atendimento</small>
            </div>
          </button>
        </div>

        <button
          className={"pill pill-lg " + (metodo === "whatsapp" ? "pill-wa" : "pill-blue")}
          disabled={busy}
          onClick={finalizar}
        >
          {busy
            ? "Abrindo pagamento..."
            : metodo === "whatsapp"
              ? "Finalizar pelo WhatsApp"
              : `Pagar ${money(t.total)}`}
        </button>
        <small className="pay-note">
          Ambiente seguro. Seus dados de pagamento não passam por este site.
        </small>
      </div>
    </section>
  );
}
