import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { Icon, ICONS } from "./Icon";
import { openWhatsApp } from "../lib/whatsapp";

export function MobileMenu() {
  const { menuOpen, closeMenu } = useUI();
  const navigate = useNavigate();
  const { logged, isAdmin, user } = useAuth();

  // trava o scroll do fundo e fecha no ESC enquanto aberto
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, closeMenu]);

  const go = (to: string) => {
    closeMenu();
    navigate(to);
  };

  const links: { label: string; to: string; icon: string }[] = [
    { label: "Início", to: "/", icon: ICONS.home },
    { label: "Atacado para empresas", to: "/atacado", icon: ICONS.store },
    { label: "Paulex Club", to: "/club", icon: ICONS.crown },
    { label: logged ? "Minha conta" : "Entrar ou cadastrar", to: logged ? "/conta" : "/login", icon: ICONS.user },
    { label: "Meus pedidos", to: "/pedidos", icon: ICONS.box },
    { label: "Favoritos", to: "/lista/favoritos", icon: ICONS.heart },
  ];

  return (
    <div className={"drawer-root" + (menuOpen ? " open" : "")} aria-hidden={!menuOpen}>
      <div className="drawer-overlay" onClick={closeMenu} />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="drawer-head">
          <img src="img/logo.png" alt="Paulex" className="logo-img logo-img-desk" />
          <button className="icon-btn" aria-label="Fechar menu" onClick={closeMenu}>
            <Icon path={ICONS.close} />
          </button>
        </div>

        {logged && (
          <button className="drawer-user" onClick={() => go(isAdmin ? "/admin" : "/conta")}>
            <span className="avatar sm">
              <Icon path={ICONS.user} />
            </span>
            <span>
              <strong>Olá, {user?.nome?.split(" ")[0] || "cliente"}!</strong>
              <small>{isAdmin ? "Ver painel administrativo" : "Ver minha conta"}</small>
            </span>
            <Icon path={ICONS.chevron} className="chev" />
          </button>
        )}

        <nav className="drawer-nav" aria-label="Categorias">
          <p className="drawer-label">Categorias</p>
          {CATEGORIES.map((c) => (
            <button key={c.id} className="drawer-cat" onClick={() => go(`/lista/cat:${c.id}`)}>
              <span className="drawer-cat-ico">
                <Icon path={c.icon} />
              </span>
              {c.nome}
              <Icon path={ICONS.chevron} className="chev" />
            </button>
          ))}
        </nav>

        <nav className="drawer-nav" aria-label="Atalhos">
          <p className="drawer-label">Navegação</p>
          {links.map((l) => (
            <button key={l.to + l.label} className="drawer-link" onClick={() => go(l.to)}>
              <Icon path={l.icon} />
              {l.label}
            </button>
          ))}
        </nav>

        <button
          className="pill pill-wa drawer-wa"
          onClick={() => {
            closeMenu();
            openWhatsApp();
          }}
        >
          <Icon path={ICONS.whatsapp} /> Falar no WhatsApp
        </button>
      </aside>
    </div>
  );
}
