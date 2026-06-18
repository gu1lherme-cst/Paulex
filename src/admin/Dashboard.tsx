import { useMemo } from "react";
import { useStore } from "../context/StoreContext";
import { BarChart } from "./Chart";
import { Icon, ICONS } from "../components/Icon";
import { money, num } from "../lib/format";

export function Dashboard() {
  const { orders, products } = useStore();

  const stats = useMemo(() => {
    const validos = orders.filter((o) => o.status !== "cancelado");
    const faturamento = validos.reduce((a, o) => a + o.total, 0);
    const itensVendidos = validos.reduce(
      (a, o) => a + o.itens.reduce((s, i) => s + i.qty, 0),
      0,
    );
    const ticket = validos.length ? faturamento / validos.length : 0;
    const estoqueBaixo = products.filter((p) => p.estoque < 50).length;

    // top produtos por quantidade vendida
    const porProduto = new Map<string, { nome: string; qty: number; receita: number }>();
    for (const o of validos) {
      for (const i of o.itens) {
        const cur = porProduto.get(i.id) || { nome: i.nome, qty: 0, receita: 0 };
        cur.qty += i.qty;
        cur.receita += i.valor;
        porProduto.set(i.id, cur);
      }
    }
    const top = [...porProduto.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

    // faturamento dos últimos 8 pedidos (mais antigo → mais novo)
    const chart = [...validos]
      .slice(0, 8)
      .reverse()
      .map((o) => ({ label: `#${o.numero}`, value: o.total }));

    return { faturamento, itensVendidos, ticket, estoqueBaixo, top, chart, pedidos: validos.length };
  }, [orders, products]);

  const kpis = [
    { icon: ICONS.tag, label: "Faturamento", value: money(stats.faturamento), tone: "blue" },
    { icon: ICONS.cart, label: "Pedidos", value: num(stats.pedidos), tone: "green" },
    { icon: ICONS.chart, label: "Ticket médio", value: money(stats.ticket), tone: "gold" },
    { icon: ICONS.box, label: "Itens vendidos", value: num(stats.itensVendidos), tone: "blue" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Visão geral da loja em tempo real.</p>
        </div>
      </header>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className={"kpi kpi-" + k.tone} key={k.label}>
            <span className="kpi-ico">
              <Icon path={k.icon} />
            </span>
            <div>
              <small>{k.label}</small>
              <strong>{k.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>Faturamento por pedido</h3>
          {stats.chart.length === 0 ? (
            <p className="muted small">
              Ainda não há pedidos. Faça um pedido na loja para ver os números
              aqui.
            </p>
          ) : (
            <BarChart data={stats.chart} format={money} />
          )}
        </div>

        <div className="admin-card">
          <h3>Produtos mais vendidos</h3>
          {stats.top.length === 0 ? (
            <p className="muted small">Sem vendas registradas ainda.</p>
          ) : (
            <table className="admin-table compact">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Receita</th>
                </tr>
              </thead>
              <tbody>
                {stats.top.map((t) => (
                  <tr key={t.nome}>
                    <td>{t.nome}</td>
                    <td>{num(t.qty)}</td>
                    <td>{money(t.receita)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {stats.estoqueBaixo > 0 && (
        <div className="admin-alert">
          <Icon path={ICONS.box} />
          <span>
            <strong>{stats.estoqueBaixo}</strong> produto(s) com estoque abaixo de
            50 unidades. Confira em Produtos.
          </span>
        </div>
      )}
    </div>
  );
}
