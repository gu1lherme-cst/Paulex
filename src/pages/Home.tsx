import type { ReactNode } from "react";
import "./Home.css";

const LOGO_SRC = "img/logo.png";

type IconName =
  | "notes"
  | "tasks"
  | "calendar"
  | "target"
  | "timer"
  | "spark"
  | "community"
  | "briefcase"
  | "certificate"
  | "chart"
  | "play"
  | "check"
  | "book"
  | "shield"
  | "rocket"
  | "layers"
  | "question"
  | "file";

const iconPaths: Record<IconName, ReactNode> = {
  notes: (
    <>
      <path d="M7 4.75h8.2L19 8.55V19a1.25 1.25 0 0 1-1.25 1.25H7A1.25 1.25 0 0 1 5.75 19V6A1.25 1.25 0 0 1 7 4.75Z" />
      <path d="M15 4.9V8.7h3.75" />
      <path d="M9 12h6" />
      <path d="M9 15.25h5" />
    </>
  ),
  tasks: (
    <>
      <path d="M7.25 5.75h9.5A1.5 1.5 0 0 1 18.25 7.25v9.5a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.75 16.75v-9.5a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="m8.75 12.2 1.55 1.55 3.7-4" />
      <path d="M8.75 16h6.5" />
    </>
  ),
  calendar: (
    <>
      <path d="M7.25 6.5h9.5A1.5 1.5 0 0 1 18.25 8v8.75a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5V8a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M8.5 4.75v3" />
      <path d="M15.5 4.75v3" />
      <path d="M5.75 10h12.5" />
      <path d="M9 13h.01" />
      <path d="M12 13h.01" />
      <path d="M15 13h.01" />
      <path d="M9 16h.01" />
      <path d="M12 16h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="6.75" />
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 12h7.25" />
      <path d="M16 8l3.25-3.25" />
      <path d="M18.75 4.75v3.5h-3.5" />
    </>
  ),
  timer: (
    <>
      <path d="M9.25 4.75h5.5" />
      <circle cx="12" cy="13" r="6.25" />
      <path d="M12 13V9.25" />
      <path d="m12 13 2.45 1.55" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.75 13.65 8.1 18 9.75l-4.35 1.65L12 15.75l-1.65-4.35L6 9.75l4.35-1.65L12 3.75Z" />
      <path d="M17 14.75 17.85 17l2.15.85-2.15.85L17 21l-.85-2.3-2.15-.85 2.15-.85.85-2.25Z" />
      <path d="M5.5 13.5 6.1 15l1.4.6-1.4.6-.6 1.55-.6-1.55-1.4-.6 1.4-.6.6-1.5Z" />
    </>
  ),
  community: (
    <>
      <path d="M8.25 11.25a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z" />
      <path d="M15.75 11.25a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z" />
      <path d="M4.5 18.25c.6-2.55 2.1-4 3.75-4s3.15 1.45 3.75 4" />
      <path d="M12 18.25c.6-2.55 2.1-4 3.75-4s3.15 1.45 3.75 4" />
    </>
  ),
  briefcase: (
    <>
      <path d="M7 8.25h10A1.75 1.75 0 0 1 18.75 10v7A1.75 1.75 0 0 1 17 18.75H7A1.75 1.75 0 0 1 5.25 17v-7A1.75 1.75 0 0 1 7 8.25Z" />
      <path d="M9.25 8.25v-1.5A1.5 1.5 0 0 1 10.75 5.25h2.5a1.5 1.5 0 0 1 1.5 1.5v1.5" />
      <path d="M5.25 12.25h13.5" />
      <path d="M12 12.25v2" />
    </>
  ),
  certificate: (
    <>
      <path d="M7.25 4.75h9.5A1.5 1.5 0 0 1 18.25 6.25v11.5a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5V6.25a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M8.75 8h6.5" />
      <path d="M8.75 11h4.25" />
      <path d="m13.5 15.2 1.1 1.05 1.9-2.25" />
    </>
  ),
  chart: (
    <>
      <path d="M5.75 18.25h12.5" />
      <path d="M8 15.75v-5.5" />
      <path d="M12 15.75v-8" />
      <path d="M16 15.75v-3.5" />
    </>
  ),
  play: <path d="M8.75 6.75v10.5l8.5-5.25-8.5-5.25Z" />,
  check: <path d="m6.75 12.3 3.25 3.2 7.25-7.5" />,
  book: (
    <>
      <path d="M6.5 5.75h5.25A2.25 2.25 0 0 1 14 8v10.25a2.75 2.75 0 0 0-2.25-1.1H6.5V5.75Z" />
      <path d="M17.5 5.75H14A2.25 2.25 0 0 0 11.75 8v10.25a2.75 2.75 0 0 1 2.25-1.1h3.5V5.75Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 4.75 18.25 7v4.65c0 4.1-2.35 6.65-6.25 7.6-3.9-.95-6.25-3.5-6.25-7.6V7L12 4.75Z" />
      <path d="m9.2 12.1 1.85 1.8 3.75-4" />
    </>
  ),
  rocket: (
    <>
      <path d="M13.25 5.25c2.55.45 4.1 2 4.55 4.55l-5.3 5.3-4.55-4.55 5.3-5.3Z" />
      <path d="M8.3 10.2 5.5 11.4l2.25 2.25-1.2 2.8 3.55-1.25" />
      <circle cx="14.5" cy="8.55" r="1" />
    </>
  ),
  layers: (
    <>
      <path d="m12 4.75 7 3.75-7 3.75-7-3.75 7-3.75Z" />
      <path d="m5 12 7 3.75L19 12" />
      <path d="m5 15.75 7 3.75 7-3.75" />
    </>
  ),
  question: (
    <>
      <path d="M9.25 9a2.75 2.75 0 0 1 5.35.9c0 2.1-2.6 2.35-2.6 4.1" />
      <path d="M12 17.25h.01" />
      <circle cx="12" cy="12" r="7.25" />
    </>
  ),
  file: (
    <>
      <path d="M7.25 4.75h7L18.25 9v8.75a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5V6.25a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M14.25 4.75v4.5h4" />
      <path d="M8.75 12h6.5" />
      <path d="M8.75 15h5" />
    </>
  ),
};

const heroIcons: Array<{ label: string; icon: IconName; tone: string }> = [
  { label: "Notas", icon: "notes", tone: "blue" },
  { label: "Tarefas", icon: "tasks", tone: "red" },
  { label: "IA", icon: "spark", tone: "purple" },
  { label: "Comunidade", icon: "community", tone: "green" },
  { label: "Calendário", icon: "calendar", tone: "yellow" },
  { label: "Carreira", icon: "briefcase", tone: "blue" },
];

const featureCards: Array<{ title: string; description: string; icon: IconName; tone: string }> = [
  {
    title: "Notas que viram revisão",
    description: "Guarde aulas, resumos e ideias em um espaço organizado para revisar quando precisar.",
    icon: "notes",
    tone: "blue",
  },
  {
    title: "Calendário de estudos",
    description: "Veja provas, trabalhos, revisões e aulas em uma rotina acadêmica simples de acompanhar.",
    icon: "calendar",
    tone: "purple",
  },
  {
    title: "Tarefas inteligentes",
    description: "Priorize o que importa, acompanhe entregas e transforme prazos em ações claras.",
    icon: "tasks",
    tone: "green",
  },
  {
    title: "Metas e hábitos",
    description: "Defina objetivos, acompanhe consistência e enxergue sua evolução com dados reais.",
    icon: "target",
    tone: "yellow",
  },
  {
    title: "Pomodoro integrado",
    description: "Estude em ciclos de foco e conecte suas sessões às tarefas e matérias certas.",
    icon: "timer",
    tone: "red",
  },
  {
    title: "IA contextual",
    description: "A IA entende suas notas, provas e metas para criar planos, resumos e exercícios melhores.",
    icon: "spark",
    tone: "purple",
  },
  {
    title: "Simulados e desempenho",
    description: "Pratique com questões, identifique pontos fracos e acompanhe sua evolução por matéria.",
    icon: "question",
    tone: "red",
  },
  {
    title: "Certificados",
    description: "Transforme trilhas concluídas em comprovações úteis para currículo e oportunidades.",
    icon: "certificate",
    tone: "green",
  },
  {
    title: "Comunidade ativa",
    description: "Entre em grupos, tire dúvidas, compartilhe materiais e aprenda com estudantes parecidos.",
    icon: "community",
    tone: "blue",
  },
  {
    title: "Carreira conectada",
    description: "Saia do estudo para vagas, estágios, mentorias, portfólio e trilhas profissionais.",
    icon: "briefcase",
    tone: "yellow",
  },
];

const communities = [
  {
    name: "Engenharia",
    members: "12.842",
    description: "Projetos, listas, dúvidas e networking.",
    activity: "+235 online agora",
    event: "Revisão de Cálculo hoje às 20h",
    tone: "blue",
  },
  {
    name: "Medicina",
    members: "9.317",
    description: "Resumos, casos clínicos e grupos de estudo.",
    activity: "+193 online agora",
    event: "Discussão de anatomia em andamento",
    tone: "green",
  },
  {
    name: "Direito",
    members: "7.654",
    description: "Jurisprudência, peças e debates de provas.",
    activity: "+142 online agora",
    event: "Plantão de Direito Penal amanhã",
    tone: "red",
  },
  {
    name: "Concursos",
    members: "15.209",
    description: "Editais, cronogramas e questões comentadas.",
    activity: "+312 online agora",
    event: "Simulado semanal liberado",
    tone: "purple",
  },
  {
    name: "Programação",
    members: "18.430",
    description: "Projetos, desafios e revisão de código.",
    activity: "+418 online agora",
    event: "Desafio React aberto",
    tone: "blue",
  },
  {
    name: "ENEM",
    members: "23.118",
    description: "Redação, simulados e plano de revisão.",
    activity: "+527 online agora",
    event: "Correção de redação às 19h",
    tone: "yellow",
  },
];

const aiCards: Array<{ title: string; description: string; icon: IconName }> = [
  { title: "Resumir PDF", description: "Transforme materiais longos em tópicos claros.", icon: "file" },
  { title: "Criar cronograma", description: "Receba uma rotina realista antes da prova.", icon: "calendar" },
  { title: "Gerar questões", description: "Pratique com perguntas baseadas no conteúdo.", icon: "question" },
  { title: "Explicar matéria", description: "Entenda conceitos difíceis em linguagem simples.", icon: "book" },
  { title: "Revisar antes da prova", description: "Monte revisões rápidas com o que mais importa.", icon: "spark" },
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para organizar a rotina sem custo.",
    features: ["Notas e tarefas", "Calendário de estudos", "Pomodoro", "Comunidades públicas"],
    cta: "Começar grátis",
    featured: false,
  },
  {
    name: "Pro",
    price: "R$ 19",
    period: "/mês",
    description: "Para acelerar estudo, foco e desempenho.",
    features: ["Tudo do Free", "IA de estudos ilimitada", "Simulados e desempenho", "Metas avançadas"],
    cta: "Assinar o Pro",
    featured: true,
  },
  {
    name: "Campus",
    price: "Sob consulta",
    period: "",
    description: "Para escolas, faculdades e instituições.",
    features: ["Tudo do Pro", "Painel para turmas", "Relatórios de evolução", "Suporte dedicado"],
    cta: "Falar com vendas",
    featured: false,
  },
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={`px-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function LogoMark({ showName = false }: { showName?: boolean }) {
  return (
    <a className="px-logo" href="#produto" aria-label="Ir para o início">
      <img src={LOGO_SRC} alt="Px" />
      {showName ? <span>Px</span> : null}
    </a>
  );
}

function Header() {
  return (
    <header className="px-header">
      <nav className="px-nav" aria-label="Navegação principal">
        <LogoMark />
        <div className="px-nav-links">
          <a href="#produto">Produto</a>
          <a href="#recursos">Recursos</a>
          <a href="#comunidade">Comunidade</a>
          <a href="#planos">Planos</a>
          <a href="#carreira">Carreira</a>
        </div>
        <div className="px-nav-actions">
          <a className="px-login" href="#entrar">Entrar</a>
          <a className="px-button px-button-primary" href="#planos">Começar grátis</a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-hero" id="produto">
      <div className="px-hero-background" aria-hidden="true" />

      <div className="px-hero-icons" aria-label="Ferramentas da plataforma">
        {heroIcons.map((item) => (
          <div className={`px-hero-icon px-tone-${item.tone}`} key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-hero-copy">
        <p className="px-badge"><Icon name="spark" /> O sistema operacional do estudante</p>
        <h1>
          Onde estudantes aprendem, se organizam e <span className="px-word-pill"><span />evoluem.</span>
        </h1>
        <p className="px-hero-subtitle">
          Notas, tarefas, calendário, metas, Pomodoro, comunidade e IA para estudantes que querem aprender melhor e construir o futuro.
        </p>
        <div className="px-hero-actions">
          <a className="px-button px-button-primary px-button-large" href="#planos">Começar gratuitamente</a>
          <a className="px-button px-button-secondary px-button-large" href="#demo"><Icon name="play" /> Ver demonstração</a>
        </div>
        <div className="px-social-proof" aria-label="Prova social">
          <div className="px-avatar-stack" aria-hidden="true">
            {['JL', 'MR', 'AC', 'BS', 'TF'].map((avatar) => <span key={avatar}>{avatar}</span>)}
          </div>
          <div>
            <strong>★★★★★ <span>4,9</span></strong>
            <p>Mais de 50 mil estudantes já estão evoluindo com a Px.</p>
          </div>
        </div>
      </div>

      <DashboardMockup />
    </section>
  );
}

function DashboardMockup() {
  const sidebar = ["Início", "Agenda", "Tarefas", "Notas", "Pomodoro", "Metas", "IA Assistente", "Simulados", "Comunidade", "Carreira"];
  const agenda = [
    { subject: "Matemática", time: "08:00", detail: "Funções", status: "Agora", tone: "blue" },
    { subject: "História", time: "10:00", detail: "Revolução Industrial", status: "Aula", tone: "red" },
    { subject: "Física", time: "14:00", detail: "Cinemática", status: "Revisão", tone: "green" },
  ];
  const deliveries = [
    ["Relatório de Biologia", "Amanhã"],
    ["Lista de Exercícios", "Em 2 dias"],
    ["Revisão de Física", "Sexta-feira"],
  ];

  return (
    <div className="px-product-shell" id="demo">
      <div className="px-window-bar">
        <div className="px-window-dots" aria-hidden="true"><span /><span /><span /></div>
        <span>app.px.com / dashboard</span>
      </div>

      <div className="px-dashboard">
        <aside className="px-sidebar">
          <LogoMark />
          <ul>
            {sidebar.map((item, index) => (
              <li className={index === 0 ? "is-active" : ""} key={item}>{item}</li>
            ))}
          </ul>
          <div className="px-sidebar-footer">Configurações</div>
        </aside>

        <section className="px-main-panel">
          <div className="px-panel-top">
            <div>
              <p className="px-panel-kicker">Resumo acadêmico</p>
              <h2>Olá, estudante.</h2>
              <span>Pequenas ações diárias geram grandes conquistas.</span>
            </div>
            <div className="px-panel-actions" aria-hidden="true">
              <span>⌕</span><span>◐</span><span className="px-user-dot">E</span>
            </div>
          </div>

          <div className="px-stats-grid">
            <Metric number="3" label="Tarefas hoje" />
            <Metric number="2h30" label="Tempo de foco" />
            <Metric number="1" label="Aula / prova" />
            <Metric number="85%" label="Meta diária" accent />
          </div>

          <div className="px-dashboard-grid">
            <div className="px-card px-agenda-card">
              <CardTitle title="Agenda do dia" action="Ver tudo" />
              <div className="px-agenda-list">
                {agenda.map((item) => (
                  <div className={`px-agenda-item px-tone-${item.tone}`} key={`${item.subject}-${item.time}`}>
                    <span className="px-agenda-line" />
                    <div>
                      <strong>{item.subject}</strong>
                      <p>{item.time} — {item.detail}</p>
                    </div>
                    <em>{item.status}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-card px-pomodoro-card">
              <CardTitle title="Pomodoro" />
              <div className="px-timer-ring">
                <div>
                  <strong>25:00</strong>
                  <span>Foco</span>
                </div>
              </div>
              <button type="button">Iniciar</button>
            </div>

            <div className="px-card px-delivery-card">
              <CardTitle title="Próximas entregas" />
              {deliveries.map(([title, date]) => (
                <div className="px-delivery-row" key={title}>
                  <span>{title}</span>
                  <strong>{date}</strong>
                </div>
              ))}
              <a href="#recursos">+ Ver todas</a>
            </div>

            <div className="px-card px-ai-card">
              <CardTitle title="IA Assistente" />
              <p>Como posso ajudar nos seus estudos?</p>
              <div className="px-ai-chips">
                <span>Resumir conteúdo</span>
                <span>Criar plano</span>
                <span>Gerar exercícios</span>
                <span>Explicar conceito</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ number, label, accent = false }: { number: string; label: string; accent?: boolean }) {
  return (
    <div className={`px-metric ${accent ? "is-accent" : ""}`}>
      <strong>{number}</strong>
      <span>{label}</span>
    </div>
  );
}

function CardTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="px-card-title">
      <h3>{title}</h3>
      {action ? <a href="#recursos">{action}</a> : null}
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="px-trust-strip" aria-label="Prova social institucional">
      <p>Utilizado por estudantes e instituições que estão transformando a educação</p>
      <div>
        {['Universidade Alpha', 'Instituto Beta', 'Escola Next', 'Campus Digital', 'EduLab', 'Future Academy'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="px-section" id="recursos">
      <SectionHeader
        eyebrow="Recursos"
        title="Tudo que você precisa para estudar melhor"
        description="Um ecossistema integrado: da primeira anotação até o primeiro estágio. Menos aplicativos soltos, mais rotina executável."
      />
      <div className="px-feature-grid">
        {featureCards.map((feature) => (
          <article className="px-feature-card" key={feature.title}>
            <div className={`px-feature-icon px-tone-${feature.tone}`}><Icon name={feature.icon} /></div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="px-section px-community-section" id="comunidade">
      <SectionHeader
        eyebrow="Comunidade"
        title="Estude com quem tem o mesmo objetivo"
        description="Comunidades precisam parecer vivas. Por isso a Px conecta grupos, discussões, eventos e materiais em torno da sua jornada."
      />
      <div className="px-community-grid">
        {communities.map((community) => (
          <article className={`px-community-card px-tone-${community.tone}`} key={community.name}>
            <div className="px-community-top">
              <span><Icon name="community" /></span>
              <small>Ativo</small>
            </div>
            <h3>{community.name}</h3>
            <strong>{community.members} membros</strong>
            <p>{community.description}</p>
            <div className="px-live-line">{community.activity}</div>
            <div className="px-event-line">{community.event}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="px-section px-ai-section" id="ia">
      <div className="px-ai-layout">
        <div>
          <p className="px-eyebrow-text">Inteligência artificial</p>
          <h2>Uma IA que entende sua rotina de estudos.</h2>
          <p>
            A Px conecta tarefas, provas, metas e anotações para criar planos personalizados, resumos inteligentes, revisões automáticas e exercícios baseados no que você precisa aprender.
          </p>
          <a className="px-button px-button-primary" href="#planos">Experimentar a IA</a>
        </div>
        <div className="px-ai-grid">
          {aiCards.map((card) => (
            <article className="px-ai-mini-card" key={card.title}>
              <Icon name={card.icon} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareerSection() {
  const career = [
    ["Vagas", "Oportunidades alinhadas ao seu perfil."],
    ["Estágios", "Primeiros passos no mercado de trabalho."],
    ["Mentorias", "Aprenda com quem já trilhou o caminho."],
    ["Certificados", "Valide conhecimentos e habilidades."],
    ["Portfólio acadêmico", "Reúna projetos e conquistas em um só perfil."],
    ["Trilhas profissionais", "Caminhos guiados para carreiras específicas."],
  ];

  return (
    <section className="px-section px-career-section" id="carreira">
      <SectionHeader
        eyebrow="Carreira"
        title="Do estudo à carreira"
        description="A plataforma deve acompanhar o estudante por anos: organização, aprendizado, comunidade, currículo, oportunidades e crescimento profissional."
      />
      <div className="px-career-grid">
        {career.map(([title, description], index) => (
          <article className="px-career-card" key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="px-section px-pricing-section" id="planos">
      <SectionHeader
        eyebrow="Planos"
        title="Comece grátis. Evolua quando fizer sentido."
        description="O freemium atrai volume. O Pro monetiza usuários de alta intenção. O Campus abre receita B2B com escolas e instituições."
      />
      <div className="px-pricing-grid">
        {plans.map((plan) => (
          <article className={`px-plan-card ${plan.featured ? "is-featured" : ""}`} key={plan.name}>
            {plan.featured ? <div className="px-plan-badge">Mais popular</div> : null}
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <div className="px-plan-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
            <ul>
              {plan.features.map((item) => (
                <li key={item}><Icon name="check" /> {item}</li>
              ))}
            </ul>
            <a className={`px-button ${plan.featured ? "px-button-primary" : "px-button-secondary"}`} href="#produto">{plan.cta}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-final-cta">
      <div className="px-final-icon"><Icon name="rocket" /></div>
      <div>
        <h2>Pronto para transformar sua rotina de estudos?</h2>
        <p>Crie sua conta gratuita e descubra como a Px pode ajudar você a aprender, se organizar e evoluir todos os dias.</p>
      </div>
      <a className="px-button px-button-light" href="#planos">Começar gratuitamente</a>
    </section>
  );
}

function Footer({ year }: { year: number }) {
  const columns = [
    { title: "Produto", links: ["Visão geral", "Demonstração", "Planos", "IA de estudos"] },
    { title: "Recursos", links: ["Notas e tarefas", "Pomodoro", "Simulados", "Certificados"] },
    { title: "Comunidade", links: ["Grupos", "Eventos", "Carreira", "Mentorias"] },
    { title: "Empresa", links: ["Sobre", "Blog", "Carreiras", "Contato"] },
    { title: "Suporte", links: ["Central de ajuda", "Privacidade", "Termos", "Status"] },
  ];

  return (
    <footer className="px-footer">
      <div className="px-footer-brand">
        <LogoMark showName />
        <p>O ecossistema completo para estudantes aprenderem, se organizarem e evoluírem.</p>
      </div>
      <div className="px-footer-columns">
        {columns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => <a href="#produto" key={link}>{link}</a>)}
          </div>
        ))}
      </div>
      <div className="px-footer-bottom">
        <span>© {year} Px. Todos os direitos reservados.</span>
        <span>Feito para estudantes que querem evoluir.</span>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="px-section-header">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{description}</span>
    </div>
  );
}

export function Home() {
  return (
    <main className="px-site">
      <Header />
      <Hero />
      <TrustStrip />
      <Features />
      <Community />
      <AISection />
      <CareerSection />
      <Pricing />
      <FinalCTA />
      <Footer year={new Date().getFullYear()} />
    </main>
  );
}

export default Home;
