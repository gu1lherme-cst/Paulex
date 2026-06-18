import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import { money, plural } from "../lib/format";
import type { OrderStatus } from "../types";

const STATUS_INFO: Record<OrderStatus, { rotulo: string; classe: string }> = {
  aguardando: { rotulo: "Aguardando confirmação", classe: "transporte" },
  pago: { rotulo: "Pago", classe: "transporte" },
  entregue: { rotulo: "Recebido", classe: "entregue" },
  cancelado: { rotulo: "Cancelado", classe: "cancelado" },
};

const TABS: { key: string; label: string; match: OrderStatus[] | null }[] = [
  { key: "todos", label: "Todos", match: null },
  { key: "andamento", label: "Em andamento", match: ["aguardando", "pago"] },
  { key: "entregues", label: "Entregues", match: ["entregue"] },
  { key: "cancelados", label: "Cancelados", match: ["cancelado"] },
];

export function Pedidos() {
  const navigate = useNavigate();
  const { logged } = useAuth();
  const { orders, setOrderStatus, addToCart } = useStore();
  const { toast } = useToast();
  const [tab, setTab] = useState("todos");
  const [open, setOpen] = useState<Set<string>>(new Set());

  if (!logged) return <Navigate to="/login" replace />;

  const active = TABS.find((t) => t.key === tab)!;
  const list = active.match
    ? orders.filter((o) => active.match!.includes(o.status))
    : orders;

  const toggle = (n: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  const repeat = (numero: string) => {
    const o = orders.find((x) => x.numero === numero);
    o?.itens.forEach((i) => addToCart(i.id, i.qty));
    navigate("/carrinho");
    toast("Itens adicionados ao carrinho");
  };

  const changeStatus = (numero: string, status: OrderStatus) => {
    if (status === "cancelado" && !confirm(`Cancelar o pedido #${numero}?`)) return;
    setOrderStatus(numero, status);
    toast(status === "entregue" ? "Que bom que chegou! 📦" : "Pedido cancelado");
  };

  return (
    <section className="screen active">
      <TopBar title="Meus Pedidos" showCart={false} />
      <div className="wrap narrow">
        <div className="tabs scroll">
          {TABS.map((tt) => (
            <button
              key={tt.key}
              className={"tab" + (tab === tt.key ? " active" : "")}
              onClick={() => setTab(tt.key)}
            >
              {tt.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="empty orders-zero">
            <p>Nenhum pedido aqui ainda.</p>
            <button className="pill pill-blue" onClick={() => navigate("/")}>
              Ver produtos
            </button>
          </div>
        ) : (
          <div className="orders">
            {list.map((o) => {
              const st = STATUS_INFO[o.status];
              const aberto = open.has(o.numero);
              return (
                <div className="order-wrap" key={o.numero}>
                  <button className="order" onClick={() => toggle(o.numero)} aria-expanded={aberto}>
                    <span className="o-ico">
                      <Icon path={ICONS.box} />
                    </span>
                    <div className="o-main">
                      <strong>Pedido #{o.numero}</strong>
                      <small>
                        {o.data} · {plural(o.itens.length, "item", "itens")}
                      </small>
                    </div>
                    <div className="o-side">
                      <span className={"status " + st.classe}>{st.rotulo}</span>
                      <strong>{money(o.total)}</strong>
                      <span className="link">{aberto ? "Fechar ‹" : "Ver detalhes ›"}</span>
                    </div>
                  </button>
                  {aberto && (
                    <div className="o-det">
                      {o.itens.map((i) => (
                        <div className="o-item" key={i.id}>
                          <span>
                            {i.qty}x {i.nome}
                          </span>
                          <span>{money(i.valor)}</span>
                        </div>
                      ))}
                      <div className="o-actions">
                        <button className="pill pill-outline" onClick={() => repeat(o.numero)}>
                          Repetir pedido
                        </button>
                        {(o.status === "aguardando" || o.status === "pago") && (
                          <>
                            <button
                              className="pill pill-blue"
                              onClick={() => changeStatus(o.numero, "entregue")}
                            >
                              Marcar como recebido
                            </button>
                            <button className="link" onClick={() => changeStatus(o.numero, "cancelado")}>
                              Cancelar pedido
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <p className="store-note">
          Os pedidos ficam salvos neste aparelho e são confirmados pelo
          atendimento.
        </p>
      </div>
    </section>
  );
}
