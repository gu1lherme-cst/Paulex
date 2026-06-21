import { memo, type ReactNode } from "react";
import "./Home.css";

type Tone = "blue" | "red" | "green" | "purple" | "yellow" | "dark";

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
  | "file"
  | "brain"
  | "map"
  | "user"
  | "shield"
  | "rocket";

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
  file: (
    <>
      <path d="M7.25 4.75h7L18.25 9v8.75a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5V6.25a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M14.25 4.75v4.5h4" />
      <path d="M8.75 12h6.5" />
      <path d="M8.75 15h5" />
    </>
  ),
  brain: (
    <>
      <path d="M9.4 5.25a3 3 0 0 0-3 3v.2a3.25 3.25 0 0 0-.1 6.25 3.05 3.05 0 0 0 3.1 4.05h.5a2.1 2.1 0 0 0 2.1-2.1V7.35a2.1 2.1 0 0 0-2.1-2.1h-.5Z" />
      <path d="M14.6 5.25a3 3 0 0 1 3 3v.2a3.25 3.25 0 0 1 .1 6.25 3.05 3.05 0 0 1-3.1 4.05h-.5a2.1 2.1 0 0 1-2.1-2.1V7.35a2.1 2.1 0 0 1 2.1-2.1h.5Z" />
      <path d="M8.25 10.75H12" />
      <path d="M12 13.25h3.75" />
    </>
  ),
  map: (
    <>
      <path d="m5.75 7.25 4.25-1.5 4 1.5 4.25-1.5v11l-4.25 1.5-4-1.5-4.25 1.5v-11Z" />
      <path d="M10 5.75v11" />
      <path d="M14 7.25v11" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.25" />
      <path d="M5.75 19.25c.9-3.4 3.05-5.1 6.25-5.1s5.35 1.7 6.25 5.1" />
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
};

const navItems = [
  { label: "Produto", href: "#produto" },
  { label: "Recursos", href: "#recursos" },
  { label: "Comunidade", href: "#comunidade" },
  { label: "IA", href: "#ia" },
  { label: "Carreira", href: "#carreira" },
  { label: "Planos", href: "#planos" },
];

const heroTools: Array<{ label: string; icon: IconName; tone: Tone }> = [
  { label: "Notas", icon: "notes", tone: "blue" },
  { label: "Tarefas", icon: "tasks", tone: "red" },
  { label: "IA", icon: "spark", tone: "purple" },
  { label: "Comunidade", icon: "community", tone: "green" },
  { label: "Carreira", icon: "briefcase", tone: "blue" },
];

const dashboardSidebar = ["Início", "Agenda", "Tarefas", "Notas", "Pomodoro", "Metas", "IA", "Comunidade", "Carreira"];

const dashboardStats = [
  { number: "3", label: "prioridades hoje" },
  { number: "2h30", label: "foco planejado" },
  { number: "85%", label: "meta diária" },
  { number: "7 dias", label: "até a prova" },
];

const studyQueue = [
  { subject: "Matemática", detail: "Funções e gráficos", time: "08:00", status: "Agora", tone: "blue" as Tone },
  { subject: "Física", detail: "Cinemática", time: "14:00", status: "Revisão", tone: "green" as Tone },
  { subject: "Redação", detail: "Repertório sociocultural", time: "19:30", status: "Prática", tone: "red" as Tone },
];

const aiSuggestions = ["Resumir PDF", "Criar cronograma", "Gerar questões", "Explicar conceito"];

const productSteps = [
  {
    title: "Capture",
    description: "Notas, PDFs, aulas, tarefas e dúvidas entram no mesmo ambiente.",
    icon: "file" as IconName,
    tone: "blue" as Tone,
  },
  {
    title: "Organize",
    description: "A rotina vira agenda, prioridades, Pomodoro e metas executáveis.",
    icon: "calendar" as IconName,
    tone: "purple" as Tone,
  },
  {
    title: "Aprenda",
    description: "A IA cria resumos, revisões, flashcards, questões e explicações.",
    icon: "brain" as IconName,
    tone: "red" as Tone,
  },
  {
    title: "Evolua",
    description: "Seu progresso forma histórico, portfólio e oportunidades de carreira.",
    icon: "rocket" as IconName,
    tone: "green" as Tone,
  },
];

const featureCards: Array<{ title: string; description: string; icon: IconName; tone: Tone }> = [
  {
    title: "Notas que viram revisão",
    description: "Guarde aulas, resumos e ideias em um espaço organizado para revisar quando precisar.",
    icon: "notes",
    tone: "blue",
  },
  {
    title: "Calendário acadêmico",
    description: "Veja provas, trabalhos, revisões e aulas em uma rotina simples de acompanhar.",
    icon: "calendar",
    tone: "purple",
  },
  {
    title: "Tarefas inteligentes",
    description: "Priorize o que importa e transforme prazos em ações claras para hoje.",
    icon: "tasks",
    tone: "green",
  },
  {
    title: "Metas e hábitos",
    description: "Acompanhe consistência, evolução por matéria e objetivos de longo prazo.",
    icon: "target",
    tone: "yellow",
  },
  {
    title: "Pomodoro integrado",
    description: "Conecte ciclos de foco às matérias, tarefas e revisões certas.",
    icon: "timer",
    tone: "red",
  },
  {
    title: "Simulados e desempenho",
    description: "Pratique com questões, identifique pontos fracos e veja sua evolução.",
    icon: "chart",
    tone: "blue",
  },
  {
    title: "Certificados",
    description: "Transforme trilhas concluídas em comprovações úteis para currículo.",
    icon: "certificate",
    tone: "green",
  },
  {
    title: "Comunidade ativa",
    description: "Entre em grupos, tire dúvidas e aprenda com estudantes do mesmo caminho.",
    icon: "community",
    tone: "purple",
  },
];

const communities = [
  {
    name: "ENEM",
    members: "23.118",
    description: "Redação, simulados e plano de revisão.",
    activity: "+527 online agora",
    event: "Correção de redação às 19h",
    tone: "yellow" as Tone,
  },
  {
    name: "Programação",
    members: "18.430",
    description: "Projetos, desafios e revisão de código.",
    activity: "+418 online agora",
    event: "Desafio React aberto",
    tone: "blue" as Tone,
  },
  {
    name: "Concursos",
    members: "15.209",
    description: "Editais, cronogramas e questões comentadas.",
    activity: "+312 online agora",
    event: "Simulado semanal liberado",
    tone: "purple" as Tone,
  },
  {
    name: "Engenharia",
    members: "12.842",
    description: "Projetos, listas, dúvidas e networking.",
    activity: "+235 online agora",
    event: "Revisão de Cálculo hoje às 20h",
    tone: "blue" as Tone,
  },
  {
    name: "Medicina",
    members: "9.317",
    description: "Resumos, casos clínicos e grupos de estudo.",
    activity: "+193 online agora",
    event: "Discussão de anatomia em andamento",
    tone: "green" as Tone,
  },
  {
    name: "Direito",
    members: "7.654",
    description: "Jurisprudência, peças e debates de provas.",
    activity: "+142 online agora",
    event: "Plantão de Direito Penal amanhã",
    tone: "red" as Tone,
  },
];

const aiCards: Array<{ title: string; description: string; icon: IconName }> = [
  { title: "Plano automático", description: "A IA monta cronogramas realistas a partir de provas, metas e tempo disponível.", icon: "calendar" },
  { title: "Resumos úteis", description: "Transforme PDFs, aulas e anotações em tópicos claros, revisões e flashcards.", icon: "file" },
  { title: "Treino direcionado", description: "Gere questões com base no conteúdo e reforce exatamente onde você errou.", icon: "target" },
  { title: "Explicação simples", description: "Receba explicações em linguagem direta, com exemplos e passos de raciocínio.", icon: "book" },
];

const careerPillars = [
  {
    title: "Perfil evolutivo",
    description: "Seu histórico de estudos, habilidades, certificados e projetos vira um perfil claro.",
  },
  {
    title: "Portfólio acadêmico",
    description: "Reúna projetos, simulados, conquistas e trilhas em uma vitrine profissional.",
  },
  {
    title: "Match de oportunidades",
    description: "Receba vagas, estágios, bolsas e mentorias compatíveis com sua evolução.",
  },
  {
    title: "Trilhas profissionais",
    description: "Caminhos guiados para tecnologia, negócios, saúde, direito, concursos e ENEM.",
  },
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a organizar a rotina sem custo.",
    features: ["Notas e tarefas", "Calendário de estudos", "Pomodoro", "Comunidades públicas"],
    cta: "Começar grátis",
    featured: false,
  },
  {
    name: "Pro",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para acelerar foco, desempenho e evolução.",
    features: ["Tudo do Free", "IA de estudos", "Simulados e desempenho", "Metas avançadas"],
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

const faqs = [
  {
    question: "A Px substitui Notion, calendário e apps de foco?",
    answer:
      "A proposta é reunir as rotinas essenciais do estudante em um fluxo único: notas, tarefas, agenda, Pomodoro, metas, IA, comunidade e carreira.",
  },
  {
    question: "A IA é genérica?",
    answer:
      "Não. A tese do produto é IA contextual: ela usa sua rotina, tarefas, provas, metas e histórico para gerar planos, revisões e exercícios mais úteis.",
  },
  {
    question: "Quando entram cursos, simulados e certificados?",
    answer:
      "Eles devem entrar em fases. Primeiro vem organização e hábito diário. Depois IA, simulados, trilhas, certificados e oportunidades de carreira.",
  },
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={`px-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {iconPaths[name]}
    </svg>
  );
}

function LogoMark({ withName = false }: { withName?: boolean }) {
  return (
    <a className="px-brand" href="#produto" aria-label="Px - início">
      <span className="px-brand-mark" aria-hidden="true">
        <span>P</span>
        <span>x</span>
      </span>
      {withName ? <span className="px-brand-name">Px</span> : null}
    </a>
  );
}

const Header = memo(function Header() {
  return (
    <header className="px-header">
      <nav className="px-nav" aria-label="Navegação principal">
        <LogoMark withName />
        <div className="px-nav-links">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="px-nav-actions">
          <a className="px-login" href="#planos">
            Entrar
          </a>
          <a className="px-button px-button-primary" href="#planos">
            Começar grátis
          </a>
        </div>
      </nav>
    </header>
  );
});

const Hero = memo(function Hero() {
  return (
    <section className="px-hero" id="produto" aria-labelledby="hero-title">
      <div className="px-hero-bg" aria-hidden="true" />

      <div className="px-tool-row" aria-label="Principais ferramentas">
        {heroTools.map((item) => (
          <div className={`px-tool-chip px-tone-${item.tone}`} key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-hero-copy">
        <p className="px-badge">
          <Icon name="spark" /> O sistema operacional do estudante
        </p>
        <h1 id="hero-title">
          Estude, organize e <span className="px-highlight-word">evolua</span> em um só lugar.
        </h1>
        <p className="px-hero-subtitle">
          A Px conecta notas, tarefas, calendário, Pomodoro, comunidade, simulados, IA e carreira para estudantes que querem aprender melhor e construir o futuro.
        </p>
        <div className="px-hero-actions">
          <a className="px-button px-button-primary px-button-large" href="#planos">
            Começar gratuitamente
          </a>
          <a className="px-button px-button-secondary px-button-large" href="#demo">
            <Icon name="play" /> Ver demonstração
          </a>
        </div>
        <div className="px-social-proof" aria-label="Prova social">
          <div className="px-avatar-stack" aria-hidden="true">
            {['JL', 'MR', 'AC', 'BS', 'TF'].map((avatar) => (
              <span key={avatar}>{avatar}</span>
            ))}
          </div>
          <div>
            <strong>★★★★★ 4,9</strong>
            <p>Mais de 50 mil estudantes já estão evoluindo com a Px.</p>
          </div>
        </div>
      </div>

      <ProductMockup />
    </section>
  );
});

const ProductMockup = memo(function ProductMockup() {
  return (
    <div className="px-product-shell" id="demo" aria-label="Demonstração do dashboard da plataforma">
      <div className="px-floating-card px-floating-card-left">
        <span>Prova em 7 dias</span>
        <strong>Plano criado pela IA</strong>
      </div>
      <div className="px-floating-card px-floating-card-right">
        <span>Perfil de carreira</span>
        <strong>72% completo</strong>
      </div>

      <div className="px-window-bar">
        <div className="px-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>app.px.com / dashboard</span>
      </div>

      <div className="px-dashboard">
        <aside className="px-sidebar" aria-label="Menu do produto">
          <LogoMark />
          <ul>
            {dashboardSidebar.map((item, index) => (
              <li className={index === 0 ? "is-active" : ""} key={item}>
                {item}
              </li>
            ))}
          </ul>
          <div className="px-sidebar-footer">
            <Icon name="shield" /> Dados sincronizados
          </div>
        </aside>

        <section className="px-main-panel">
          <div className="px-panel-top">
            <div>
              <p className="px-panel-kicker">Resumo acadêmico</p>
              <h2>Olá, estudante.</h2>
              <span>Pequenas ações diárias geram grandes conquistas.</span>
            </div>
            <div className="px-panel-actions" aria-hidden="true">
              <span>⌕</span>
              <span>◐</span>
              <span className="px-user-dot">E</span>
            </div>
          </div>

          <div className="px-stats-grid">
            {dashboardStats.map((stat, index) => (
              <Metric key={stat.label} number={stat.number} label={stat.label} accent={index === 2} />
            ))}
          </div>

          <div className="px-dashboard-grid">
            <article className="px-card px-agenda-card">
              <CardTitle title="Plano de hoje" action="Ver semana" />
              <div className="px-agenda-list">
                {studyQueue.map((item) => (
                  <div className={`px-agenda-item px-tone-${item.tone}`} key={`${item.subject}-${item.time}`}>
                    <span className="px-agenda-line" />
                    <div>
                      <strong>{item.subject}</strong>
                      <p>
                        {item.time} — {item.detail}
                      </p>
                    </div>
                    <em>{item.status}</em>
                  </div>
                ))}
              </div>
            </article>

            <article className="px-card px-pomodoro-card">
              <CardTitle title="Foco" />
              <div className="px-timer-ring">
                <div>
                  <strong>25:00</strong>
                  <span>Pomodoro</span>
                </div>
              </div>
              <button type="button">Iniciar sessão</button>
            </article>

            <article className="px-card px-career-mini-card">
              <CardTitle title="Carreira" />
              <div className="px-career-score">
                <strong>72</strong>
                <span>/100</span>
              </div>
              <p>Seu portfólio acadêmico ganhou 3 novos sinais esta semana.</p>
              <a href="#carreira">Ver perfil</a>
            </article>

            <article className="px-card px-ai-card">
              <CardTitle title="IA Assistente" />
              <p>Como posso ajudar nos seus estudos hoje?</p>
              <div className="px-ai-chips">
                {aiSuggestions.map((suggestion) => (
                  <span key={suggestion}>{suggestion}</span>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
});

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

function SectionHeader({
  eyebrow,
  title,
  description,
  titleId,
}: {
  eyebrow: string;
  title: string;
  description: string;
  titleId?: string;
}) {
  return (
    <div className="px-section-header">
      <p>{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
      <span>{description}</span>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="px-trust-strip" aria-label="Prova social institucional">
      <p>Construído para estudantes, turmas e instituições que querem transformar rotina em resultado</p>
      <div>
        {['Universidade Alpha', 'Instituto Beta', 'Escola Next', 'Campus Digital', 'EduLab', 'Future Academy'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function ProductSystem() {
  return (
    <section className="px-section px-system-section" aria-labelledby="system-title">
      <SectionHeader
        eyebrow="Sistema"
        titleId="system-title"
        title="Um fluxo, não dez aplicativos soltos."
        description="A força da Px não é ter muitas ferramentas. É conectar cada ferramenta ao próximo passo do estudante."
      />
      <div className="px-step-grid">
        {productSteps.map((step, index) => (
          <article className={`px-step-card px-tone-${step.tone}`} key={step.title}>
            <span className="px-step-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="px-step-icon">
              <Icon name={step.icon} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="px-section" id="recursos" aria-labelledby="features-title">
      <SectionHeader
        eyebrow="Recursos"
        titleId="features-title"
        title="Tudo que você precisa para estudar melhor."
        description="Organização, foco, IA, comunidade e evolução profissional em uma experiência simples, direta e moderna."
      />
      <div className="px-feature-grid">
        {featureCards.map((feature) => (
          <article className={`px-feature-card px-tone-${feature.tone}`} key={feature.title}>
            <div className="px-feature-icon">
              <Icon name={feature.icon} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="px-section px-ai-section" id="ia" aria-labelledby="ai-title">
      <div className="px-ai-layout">
        <div>
          <p className="px-eyebrow-text">Inteligência artificial</p>
          <h2 id="ai-title">Uma IA que entende sua rotina de estudos.</h2>
          <p>
            A Px conecta suas tarefas, provas, metas e anotações para criar planos personalizados, resumos inteligentes, revisões automáticas e exercícios baseados no que você precisa aprender agora.
          </p>
          <a className="px-button px-button-primary" href="#planos">
            Experimentar a IA
          </a>
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

function Community() {
  return (
    <section className="px-section px-community-section" id="comunidade" aria-labelledby="community-title">
      <SectionHeader
        eyebrow="Comunidade"
        titleId="community-title"
        title="Estude com gente que está na mesma jornada."
        description="Grupos ativos por objetivo, curso e área profissional. Aprendizado fica mais forte quando o estudante não está sozinho."
      />
      <div className="px-community-grid">
        {communities.map((community) => (
          <article className={`px-community-card px-tone-${community.tone}`} key={community.name}>
            <div className="px-community-top">
              <span aria-hidden="true">
                <Icon name="community" />
              </span>
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

function CareerSection() {
  return (
    <section className="px-section px-career-section" id="carreira" aria-labelledby="career-title">
      <div className="px-career-layout">
        <div className="px-career-content">
          <p className="px-eyebrow-text">Carreira</p>
          <h2 id="career-title">Do estudo à carreira.</h2>
          <p className="px-career-lead">
            Seu estudo vira histórico. Seu histórico vira portfólio. Seu portfólio vira oportunidade.
          </p>
          <p>
            A camada de carreira transforma evolução acadêmica em sinais úteis para estágios, bolsas, mentorias, vagas e trilhas profissionais.
          </p>
          <div className="px-career-actions">
            <a className="px-button px-button-primary" href="#planos">
              Criar meu perfil de carreira
            </a>
            <a className="px-button px-button-secondary" href="#recursos">
              Ver trilhas profissionais
            </a>
          </div>
        </div>

        <div className="px-career-profile" aria-label="Mockup de perfil de carreira">
          <div className="px-profile-header">
            <div className="px-profile-avatar">A</div>
            <div>
              <strong>Ana Clara</strong>
              <span>Estudante de Engenharia</span>
            </div>
            <em>Perfil 72%</em>
          </div>

          <div className="px-skill-block">
            <div className="px-skill-row">
              <span>Raciocínio lógico</span>
              <strong>88%</strong>
            </div>
            <div className="px-progress-line"><span style={{ width: "88%" }} /></div>
            <div className="px-skill-row">
              <span>Gestão de tempo</span>
              <strong>76%</strong>
            </div>
            <div className="px-progress-line"><span style={{ width: "76%" }} /></div>
            <div className="px-skill-row">
              <span>Comunicação escrita</span>
              <strong>69%</strong>
            </div>
            <div className="px-progress-line"><span style={{ width: "69%" }} /></div>
          </div>

          <div className="px-opportunity-list">
            <div>
              <span>Oportunidade recomendada</span>
              <strong>Estágio em tecnologia educacional</strong>
            </div>
            <div>
              <span>Próxima trilha</span>
              <strong>Dados para estudantes</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="px-career-grid">
        {careerPillars.map((item, index) => (
          <article className="px-career-card" key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className="px-b2b-note">
        <Icon name="briefcase" />
        <p>
          Futuro B2B: empresas e instituições podem encontrar jovens talentos com sinais reais de evolução, não apenas currículos genéricos.
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="px-section px-pricing-section" id="planos" aria-labelledby="pricing-title">
      <SectionHeader
        eyebrow="Planos"
        titleId="pricing-title"
        title="Comece simples. Escale conforme evolui."
        description="Freemium para aquisição, Pro para estudantes ambiciosos e Campus para instituições."
      />
      <div className="px-pricing-grid">
        {plans.map((plan) => (
          <article className={`px-plan-card ${plan.featured ? "is-featured" : ""}`} key={plan.name}>
            {plan.featured ? <div className="px-plan-badge">Mais popular</div> : null}
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <div className="px-price">
              <strong>{plan.price}</strong>
              <span>{plan.period}</span>
            </div>
            <ul>
              {plan.features.map((item) => (
                <li key={item}>
                  <Icon name="check" /> {item}
                </li>
              ))}
            </ul>
            <a className={`px-button ${plan.featured ? "px-button-primary" : "px-button-secondary"}`} href="#produto">
              {plan.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="px-section px-faq-section" aria-labelledby="faq-title">
      <SectionHeader
        eyebrow="Decisões de produto"
        titleId="faq-title"
        title="Construído para virar hábito diário."
        description="O foco inicial deve ser retenção: fazer o estudante voltar todos os dias para estudar, organizar e evoluir."
      />
      <div className="px-faq-list">
        {faqs.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-final-cta" aria-labelledby="final-cta-title">
      <p className="px-eyebrow-text">Próximo passo</p>
      <h2 id="final-cta-title">Pronto para transformar sua rotina de estudos?</h2>
      <p>Crie sua conta gratuita e descubra como a Px pode ajudar você a aprender, se organizar e evoluir todos os dias.</p>
      <a className="px-button px-button-light px-button-large" href="#planos">
        Começar gratuitamente
      </a>
    </section>
  );
}

function Footer({ year }: { year: number }) {
  const columns = [
    { title: "Produto", links: ["Visão geral", "Demonstração", "Planos", "IA de estudos"] },
    { title: "Recursos", links: ["Notas e tarefas", "Pomodoro", "Simulados", "Certificados"] },
    { title: "Comunidade", links: ["Grupos", "Eventos", "Carreira", "Mentorias"] },
    { title: "Empresa", links: ["Sobre", "Blog", "Carreiras", "Contato"] },
    { title: "Suporte", links: ["Ajuda", "Privacidade", "Termos", "Status"] },
  ];

  return (
    <footer className="px-footer">
      <div className="px-footer-brand">
        <LogoMark withName />
        <p>O ecossistema completo para estudantes aprenderem, se organizarem e evoluírem.</p>
      </div>
      <div className="px-footer-grid">
        {columns.map((column) => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <a href="#produto" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="px-footer-bottom">© {year} Px. Todos os direitos reservados.</div>
    </footer>
  );
}

export const Home = memo(function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="px-site">
      <Header />
      <Hero />
      <TrustStrip />
      <ProductSystem />
      <Features />
      <AISection />
      <Community />
      <CareerSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer year={year} />
    </main>
  );
});

export default Home;
