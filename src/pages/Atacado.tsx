import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import { openWhatsApp } from "../lib/whatsapp";

export function Atacado() {
  const navigate = useNavigate();
  const orcamento = () =>
    openWhatsApp("Olá, Paulex! Gostaria de um orçamento de atacado para empresa.");

  return (
    <section className="screen active">
      <TopBar title="Atacado" />

      <div className="biz-hero">
        <span className="biz-badge light">Atacado e varejo desde 1984</span>
        <h2>
          Compre em quantidade,
          <br />
          pague preço de atacado.
        </h2>
        <p>
          Acima de <strong>12 peças</strong> do mesmo produto, o desconto de
          atacado é aplicado automaticamente — sem cadastro e sem pedido mínimo
          de valor.
        </p>
        <div className="cta-row">
          <button className="pill pill-white" onClick={orcamento}>
            <Icon path={ICONS.whatsapp} /> Pedir orçamento
          </button>
          <button className="pill pill-ghost" onClick={() => navigate("/lista/maisvendidos")}>
            Ver produtos
          </button>
        </div>
      </div>

      <div className="wrap">
        <div className="section">
          <h3 className="sec-title">Feito para quem compra em volume.</h3>
          <p className="sec-sub">
            Atendemos empresas de todos os tamanhos com preço, prazo e atenção
            que o varejo não dá.
          </p>
          <div className="biz-grid">
            <div className="biz-card"><span className="biz-ico">🏫</span><strong>Escolas e creches</strong><small>Listas de material, papelaria e descartáveis para o ano todo.</small></div>
            <div className="biz-card"><span className="biz-ico">🏪</span><strong>Lojas e revendedores</strong><small>Reposição de estoque com margem para revender.</small></div>
            <div className="biz-card"><span className="biz-ico">🏢</span><strong>Escritórios e empresas</strong><small>Suprimentos, informática e utilidades para o dia a dia.</small></div>
            <div className="biz-card"><span className="biz-ico">🎉</span><strong>Eventos e festas</strong><small>Descartáveis e itens em grande quantidade.</small></div>
          </div>
        </div>

        <div className="section alt">
          <h3 className="sec-title">Como funciona.</h3>
          <div className="steps">
            <div className="step"><span>1</span><div><strong>Monte seu pedido</strong><small>Adicione 12 ou mais peças do mesmo item e o preço de atacado aparece sozinho.</small></div></div>
            <div className="step"><span>2</span><div><strong>Ou peça um orçamento</strong><small>Tem uma lista grande? Mande pelo WhatsApp que preparamos a melhor condição.</small></div></div>
            <div className="step"><span>3</span><div><strong>Confirmação e entrega</strong><small>Combinamos pagamento, nota e prazo de entrega.</small></div></div>
          </div>
          <button className="pill pill-wa sec-cta" onClick={orcamento}>
            <Icon path={ICONS.whatsapp} /> Falar com o atacado
          </button>
        </div>
      </div>
    </section>
  );
}
