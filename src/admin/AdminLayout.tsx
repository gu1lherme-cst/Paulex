import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon, ICONS } from "../components/Icon";

export function AdminLayout() {
  const { isAdmin, logged, user } = useAuth();
  const navigate = useNavigate();

  if (!logged) return <Navigate to="/login" replace />;
  if (!isAdmin)
    return (
      <div className="admin">
        <div className="admin-main">
          <div className="empty orders-zero">
            <p>Esta área é restrita à administração da loja.</p>
            <button className="pill pill-blue" onClick={() => navigate("/")}>
              Voltar à loja
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand">
          <img src="img/logo.png" alt="Paulex" className="logo-img" />
          <span className="admin-tag">Admin</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <Icon path={ICONS.chart} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/produtos">
            <Icon path={ICONS.box} /> <span>Produtos</span>
          </NavLink>
          <NavLink to="/admin/pedidos">
            <Icon path={ICONS.cart} /> <span>Pedidos</span>
          </NavLink>
        </nav>
        <div className="admin-side-foot">
          <button className="admin-back" onClick={() => navigate("/")}>
            <Icon path={ICONS.back} /> <span>Voltar à loja</span>
          </button>
          <small className="muted">{user?.email}</small>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
