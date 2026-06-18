import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import { num } from "../lib/format";
import { clubLevel, clubPoints } from "../lib/club";

const LEVELS = [
  { nome: "Bronze", faixa: "0 – 999 pts", perks: ["Cupons mensais", "Cashback de 1%"] },
  { nome: "Prata", faixa: "1.000 – 4.999 pts", perks: ["Cashback de 2%", "Cupons exclusivos", "Ofertas antecipadas"] },
  { nome: "Ouro", faixa: "5.000+ pts", perks: ["Cashback de 3%", "Frete especial", "Atendimento prioritário"] },
];

export function Club() {
  const navigate = useNavigate();
  const { orders, applyCupom } = useStore();
  const { logged } = useAuth();
  const { toast } = useToast();

  const pts = clubPoints(orders);
  const lv = clubLevel(pts);

  const usarCupom = (cod: string) => {
    applyCupom(cod);
    toast(`Cupom ${cod} aplicado!`);
    navigate("/carrinho");
  };

  return (
    <section className="screen active">
      <TopBar title="Paulex Club" showCart={false} />
      <div className="wrap club-wrap">
        {logged ? (
          <div className="club-card">
            <div className="club-crown">
              <Icon path={ICONS.crown} />
            </div>
            <small>Seus pontos</small>
            <strong className="club-pts">
              {num(pts)} <span>pts</span>
            </strong>
            <small className="club-next">
              {lv.prox
                ? pts === 0
                  ? "Faça seu primeiro pedido para começar a pontuar"
                  : `Faltam ${num(lv.prox.pts - pts)} pts para o nível ${lv.prox.nome}`
                : "Você está no nível máximo. Obrigado pela parceria!"}
            </small>
            <div className="club-progress">
              <span
                style={{
                  width: lv.prox
                    ? `${Math.min(100, ((pts - lv.base) / (lv.prox.pts - lv.base)) * 100)}%`
                    : "100%",
                }}
              />
            </div>
            <div className="club-levels">
              <span>{lv.nome}</span>
              <span>{lv.prox?.nome || "★"}</span>
            </div>
          </div>
        ) : (
          <div className="club-login-cta">
            <p>Entre na sua conta para acompanhar seus pontos e resgatar benefícios.</p>
            <button className="pill pill-blue" onClick={() => navigate("/login")}>
              Entrar ou criar conta
            </button>
          </div>
        )}

        <h3 className="levels-title">Cupons disponíveis</h3>
        <div className="club-panel">
          <div className="cupom-row">
            <div>
              <strong>PAULEX10</strong>
              <small>10% de desconto</small>
            </div>
            <button className="pill pill-blue" onClick={() => usarCupom("PAULEX10")}>
              Usar
            </button>
          </div>
          <div className="cupom-row">
            <div>
              <strong>CLUB5</strong>
              <small>5% de desconto</small>
            </div>
            <button className="pill pill-blue" onClick={() => usarCupom("CLUB5")}>
              Usar
            </button>
          </div>
        </div>

        <h3 className="levels-title">Níveis do Club</h3>
        <div className="levels">
          {LEVELS.map((l) => (
            <div
              className={"level" + (l.nome === lv.nome ? " featured" : "")}
              key={l.nome}
            >
              <span className={"level-medal " + l.nome.toLowerCase()}>
                <Icon path={ICONS.star} />
              </span>
              <strong>{l.nome}</strong>
              <small>{l.faixa}</small>
              <ul>
                {l.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
