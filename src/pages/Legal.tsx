import { TopBar } from "../components/Layout";

export function Privacidade() {
  return (
    <section className="screen active">
      <TopBar title="Política de Privacidade" showCart={false} />
      <div className="wrap narrow legal">
        <p className="muted">Última atualização: junho de 2026</p>
        <p>
          A <strong>Paulex Armarinho</strong> respeita a sua privacidade. Esta
          política explica, de forma simples, como tratamos as suas informações
          quando você usa o nosso site.
        </p>
        <h3>Quais dados coletamos</h3>
        <p>
          O site funciona sem cadastro obrigatório. Guardamos no{" "}
          <strong>seu próprio navegador</strong> o conteúdo do carrinho, os
          favoritos, os produtos vistos recentemente e o cupom aplicado.
        </p>
        <h3>Pedidos pelo WhatsApp</h3>
        <p>
          Ao finalizar um pedido pelo WhatsApp, o resumo é enviado ao nosso
          atendimento e usado apenas para concluir a sua compra e a entrega.
        </p>
        <h3>Seus direitos (LGPD)</h3>
        <p>
          Nos termos da Lei 13.709/2018, você pode solicitar acesso, correção ou
          exclusão dos seus dados pelo WhatsApp <strong>(21) 98757-8187</strong>.
        </p>
      </div>
    </section>
  );
}

export function Termos() {
  return (
    <section className="screen active">
      <TopBar title="Termos de Uso" showCart={false} />
      <div className="wrap narrow legal">
        <p className="muted">Última atualização: junho de 2026</p>
        <p>
          Ao usar o site da <strong>Paulex Armarinho</strong>, você concorda com
          os termos abaixo.
        </p>
        <h3>Preços e disponibilidade</h3>
        <p>
          Os preços, condições de desconto por quantidade e a disponibilidade de
          estoque são informativos e podem ser atualizados sem aviso prévio.
        </p>
        <h3>Trocas e devoluções</h3>
        <p>
          Seguimos o Código de Defesa do Consumidor: em compras a distância, você
          pode desistir em até 7 dias corridos após o recebimento.
        </p>
        <h3>Contato</h3>
        <p>
          Dúvidas: WhatsApp <strong>(21) 98757-8187</strong>, de segunda a
          sábado, das 8h às 18h.
        </p>
      </div>
    </section>
  );
}
