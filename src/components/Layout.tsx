import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon, ICONS } from "./Icon";
import { useStore } from "../context/StoreContext";

function CartBadge() {
  const { cartCount } = useStore();
  if (!cartCount) return null;
  return <span className="badge cart-badge">{cartCount}</span>;
}

function DeskHeader() {
  const navigate = useNavigate();
  return (
    <header className="desk-header">
      <div className="wrap desk-wrap">
        <button className="desk-logo" onClick={() => navigate("/")} aria-label="Início">
          <img src="img/logo.png" alt="Paulex" className="logo-img logo-img-desk" />
        </button>
        <nav className="desk-nav">
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/categorias">Categorias</NavLink>
          <NavLink to="/atacado">Atacado</NavLink>
          <NavLink to="/club">Paulex Club</NavLink>
          <NavLink to="/conta">Conta</NavLink>
          <button
            className="desk-cart"
            aria-label="Carrinho"
            onClick={() => navigate("/carrinho")}
          >
            <Icon path={ICONS.cart} />
            <CartBadge />
          </button>
        </nav>
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        <Icon path={ICONS.home} />
        <span>Início</span>
      </NavLink>
      <NavLink to="/categorias">
        <Icon path={ICONS.grid} />
        <span>Categorias</span>
      </NavLink>
      <NavLink to="/carrinho" className="has-badge">
        <Icon path={ICONS.cart} />
        <span>Carrinho</span>
        <CartBadge />
      </NavLink>
      <NavLink to="/club">
        <Icon path={ICONS.crown} />
        <span>Club</span>
      </NavLink>
      <NavLink to="/conta">
        <Icon path={ICONS.user} />
        <span>Conta</span>
      </NavLink>
    </nav>
  );
}

export function Layout() {
  const location = useLocation();
  // some páginas (admin) usam layout próprio
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return <Outlet />;

  return (
    <div className="app">
      <DeskHeader />
      <Outlet />
      <BottomNav />
    </div>
  );
}

/* Barra superior reutilizável das telas internas (mobile) */
export function TopBar({
  title,
  showCart = true,
  right,
}: {
  title: string;
  showCart?: boolean;
  right?: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="topbar topbar-title">
      <button className="icon-btn" aria-label="Voltar" onClick={() => navigate(-1)}>
        <Icon path={ICONS.back} />
      </button>
      <h2>{title}</h2>
      {right ? (
        right
      ) : showCart ? (
        <button
          className="icon-btn has-badge"
          aria-label="Carrinho"
          onClick={() => navigate("/carrinho")}
        >
          <Icon path={ICONS.cart} />
          <CartBadge />
        </button>
      ) : (
        <span className="icon-btn" aria-hidden="true" />
      )}
    </header>
  );
}
