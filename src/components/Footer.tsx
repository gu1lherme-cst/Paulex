import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { Icon, ICONS } from "./Icon";
import { openWhatsApp } from "../lib/whatsapp";
import { useToast } from "../context/ToastContext";

export function Footer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="f-col f-brand">
          <img src="img/logo.png" alt="Paulex" className="logo-img" />
          <p>
            Há mais de 40 anos oferecendo qualidade, confiança e variedade para
            famílias, estudantes, empresas e revendedores.
          </p>
          <div className="f-social">
            <button aria-label="WhatsApp" onClick={() => openWhatsApp()}>
              <Icon path={ICONS.whatsapp} />
            </button>
            <button aria-label="Instagram" onClick={() => toast("Em breve no Instagram!")}>
              <Icon path={ICONS.heart} />
            </button>
          </div>
        </div>
        <div className="f-col">
          <h4>Categorias</h4>
          <div className="f-links">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => navigate(`/lista/cat:${c.id}`)}>
                {c.nome}
              </button>
            ))}
          </div>
        </div>
        <div className="f-col">
          <h4>Institucional</h4>
          <div className="f-links">
            <button onClick={() => navigate("/atacado")}>Atacado para empresas</button>
            <button onClick={() => navigate("/club")}>Paulex Club</button>
            <button onClick={() => navigate("/privacidade")}>Política de Privacidade</button>
            <button onClick={() => navigate("/termos")}>Termos de Uso</button>
          </div>
        </div>
        <div className="f-col">
          <h4>Atendimento</h4>
          <div className="f-links">
            <button onClick={() => openWhatsApp()}>WhatsApp (21) 98757-8187</button>
            <span className="f-note">Segunda a sábado, 8h às 18h</span>
          </div>
        </div>
      </div>
      <div className="wrap f-bottom">
        <span>
          <strong>Paulex Armarinho</strong> — Desde 1984. Todos os direitos
          reservados.
        </span>
      </div>
    </footer>
  );
}
