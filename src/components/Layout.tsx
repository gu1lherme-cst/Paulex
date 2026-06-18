import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon, ICONS } from "./Icon";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/catalog";
import { MobileMenu } from "./MobileMenu";

function CartBadge() {
  const { cartCount } = useStore();
  if (!cartCount) return null;
  // a key força a re-montagem para reanimar o "bump" a cada mudança
  return (
    <span className="badge cart-badge" key={cartCount}>
      {cartCount}
    </span>
  );
}

function DeskHeader() {
  const navigate = useNavigate();
  return (
    <header className="desk-header">
      <div className="wrap desk-wrap">
        <button className="desk-logo" onClick={() => navigate("/")} aria-label="Ir para o início">
          <img src="img/logo.png" alt="Paulex Armarinho" className="logo-img logo-img-desk" />
        </button>
        <nav className="desk-nav" aria-label="Navegação principal">
          <NavLink to="/" end>
            Início
          </NavLink>
          <div className="desk-drop">
            <NavLink to="/categorias" className="desk-drop-trigger">
              Categorias
              <Icon path={ICONS.chevron} size={16} className="desk-drop-caret" />
            </NavLink>
            <div className="desk-menu" role="menu">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  role="menuitem"
                  onClick={() => navigate(`/lista/cat:${c.id}`)}
                >
                  <span className="desk-menu-ico">
                    <Icon path={c.icon} size={18} />
                  </span>
                  <span>
                    <strong>{c.nome}</strong>
                    <small>{c.desc}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <NavLink to="/atacado">Atacado</NavLink>
          <NavLink to="/club">Paulex Club</NavLink>
          <NavLink to="/conta">Conta</NavLink>
          <button className="desk-cart" aria-label="Carrinho" onClick={() => navigate("/carrinho")}>
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
    <nav className="bottom-nav" aria-label="Navegação inferior">
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
  // o painel administrativo usa layout próprio
  if (location.pathname.startsWith("/admin")) return <Outlet />;

  return (
    <div className="app">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <DeskHeader />
      <main id="conteudo">
        <Outlet />
      </main>
      <BottomNav />
      <MobileMenu />
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
