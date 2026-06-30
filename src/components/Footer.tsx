import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { href } from "../lib/router";
import { CATEGORIES, categorySlug } from "../data/catalog";
import { WHATSAPP_CONTACT } from "../lib/format";

/* Links institucionais/legais ainda sem página própria abrem o WhatsApp
   (canal real de atendimento). Ver "evolução futura" no relatório. */
const SOON = WHATSAPP_CONTACT;
const cat = (c: string) => href(`/categoria/${categorySlug(c)}`);

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="px-footer">
      <button className="px-totop" onClick={scrollTop}>
        <Icon name="up" size={16} /> Voltar ao topo
      </button>

      <div className="px-footer__in">
        <div className="px-footer__cols">
          <div>
            <h4>Conheça a Paulex</h4>
            <ul>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Nossa história</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Trabalhe conosco</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Lojas físicas</a></li>
              <li><a href={href("/produtos")} className="px-foot-link">Todos os produtos</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Política de trocas</a></li>
            </ul>
          </div>
          <div>
            <h4>Categorias</h4>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c}><a href={cat(c)} className="px-foot-link">{c}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Atendimento</h4>
            <ul>
              <li><a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-foot-link">Fale conosco</a></li>
              <li><a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-foot-link">WhatsApp</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Entrega e retirada</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Trocas e devoluções</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Perguntas frequentes</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Política de privacidade</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Termos de uso</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4>Redes sociais</h4>
            <ul>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link px-foot-link--ic"><Icon name="instagram" size={15} />Instagram</a></li>
              <li><a href={WHATSAPP_CONTACT} target="_blank" rel="noopener noreferrer" className="px-foot-link px-foot-link--ic"><Icon name="whatsapp" size={15} />WhatsApp</a></li>
              <li><a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link px-foot-link--ic"><Icon name="facebook" size={15} />Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="px-footer__base">
          <Logo variant="muted" />
          <span className="px-footer__legal">© 2026 Paulex Armarinho LTDA. · CNPJ 59.340.421/0001-04</span>
          <a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Privacidade</a>
          <a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Termos</a>
          <a href={SOON} target="_blank" rel="noopener noreferrer" className="px-foot-link">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
