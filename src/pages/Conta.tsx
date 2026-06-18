import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import { clubLevel, clubPoints } from "../lib/club";

export function Conta() {
  const navigate = useNavigate();
  const { logged, user, isAdmin, logout } = useAuth();
  const { orders } = useStore();
  const { toast } = useToast();

  if (!logged) return <Navigate to="/login" replace />;

  const lv = clubLevel(clubPoints(orders));
  const nome = user?.nome ? user.nome.split(" ")[0] : "cliente";

  const item = (icon: string, label: string, onClick: () => void) => (
    <button className="menu-item" onClick={onClick}>
      <Icon path={icon} />
      <span>{label}</span>
      <Icon path={ICONS.chevron} className="chev" />
    </button>
  );

  return (
    <section className="screen active">
      <TopBar title="Minha Conta" showCart={false} />
      <div className="wrap narrow">
        <div className="account-head">
          <span className="avatar">
            <Icon path={ICONS.user} />
          </span>
          <div>
            <strong>Olá, {nome}!</strong>
            <small className="muted">
              {user?.email ? `${user.email} · ` : ""}Paulex Club {lv.nome}
            </small>
          </div>
        </div>

        <div className="menu">
          {isAdmin && item(ICONS.chart, "Painel Administrativo", () => navigate("/admin"))}
          {item(ICONS.box, "Meus Pedidos", () => navigate("/pedidos"))}
          {item(ICONS.pin, "Meus Endereços", () => navigate("/enderecos"))}
          {item(ICONS.heart, "Favoritos", () => navigate("/lista/favoritos"))}
          {item(ICONS.crown, "Paulex Club", () => navigate("/club"))}
          {item(ICONS.logout, "Sair", () => {
            logout();
            toast("Você saiu da sua conta");
            navigate("/login");
          })}
        </div>
      </div>
    </section>
  );
}
