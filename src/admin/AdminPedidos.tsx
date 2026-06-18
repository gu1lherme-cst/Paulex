import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { money, num } from "../lib/format";
import type { OrderStatus } from "../types";

const STATUS: Record<OrderStatus, string> = {
  aguardando: "Aguardando",
  pago: "Pago",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const FILTERS: { key: "todos" | OrderStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "aguardando", label: "Aguardando" },
  { key: "pago", label: "Pagos" },
  { key: "entregue", label: "Entregues" },
  { key: "cancelado", label: "Cancelados" },
];

export function AdminPedidos() {
  const { orders, setOrderStatus } = useStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"todos" | OrderStatus>("todos");

  const list = filter === "todos" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <h1>Pedidos</h1>
          <p className="muted">{orders.length} pedidos no total.</p>
        </div>
      </header>

      <div className="tabs scroll">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={"tab" + (filter === f.key ? " active" : "")}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {list.length === 0 ? (
          <p className="muted small">Nenhum pedido neste filtro.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Pagamento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.numero}>
                  <td>#{o.numero}</td>
                  <td>{o.data}</td>
                  <td>{o.cliente?.nome || "—"}</td>
                  <td>{num(o.itens.reduce((a, i) => a + i.qty, 0))}</td>
                  <td>{money(o.total)}</td>
                  <td className="cap">{o.pagamento || "—"}</td>
                  <td>
                    <select
                      className={"status-select st-" + o.status}
                      value={o.status}
                      onChange={(e) => {
                        setOrderStatus(o.numero, e.target.value as OrderStatus);
                        toast(`Pedido #${o.numero} atualizado`);
                      }}
                    >
                      {Object.entries(STATUS).map(([k, v]) => (
                        <option value={k} key={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
