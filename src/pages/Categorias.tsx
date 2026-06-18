import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../data/catalog";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";

export function Categorias() {
  const navigate = useNavigate();
  return (
    <section className="screen active">
      <TopBar title="Categorias" />
      <div className="wrap">
        <div className="cat-list">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className="cat-card"
              onClick={() => navigate(`/lista/cat:${c.id}`)}
            >
              <span className="cat-ico">
                <Icon path={c.icon} />
              </span>
              <div>
                <strong>{c.nome}</strong>
                <small>{c.desc}</small>
              </div>
              <Icon path={ICONS.chevron} className="chev" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
