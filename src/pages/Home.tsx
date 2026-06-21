import { memo, type ReactNode } from "react";
import "./Home.css";

type Tone = "blue" | "red" | "green" | "purple" | "yellow" | "dark";

type IconName =
  | "stack"
  | "gift"
  | "users"
  | "card"
  | "briefcase"
  | "file"
  | "tasks"
  | "calendar"
  | "spark"
  | "community"
  | "notes"
  | "timer"
  | "target"
  | "brain"
  | "book"
  | "chart"
  | "certificate"
  | "shield"
  | "rocket"
  | "play"
  | "check"
  | "chevron"
  | "search"
  | "bell"
  | "home"
  | "send"
  | "map";

const iconPaths: Record<IconName, ReactNode> = {
  stack: (
    <>
      <path d="M12 3 3.6 7.4 12 11.8l8.4-4.4L12 3Z" />
      <path d="m3.6 12.1 8.4 4.4 8.4-4.4" />
      <path d="m3.6 16.6 8.4 4.4 8.4-4.4" />
    </>
  ),
  gift: (
    <>
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8" />
      <path d="M2.8 8h18.4v4H2.8z" />
      <path d="M12 8v13" />
      <path d="M12 8H8.5a2.5 2.5 0 1 1 2.3-3.5L12 8Z" />
      <path d="M12 8h3.5a2.5 2.5 0 1 0-2.3-3.5L12 8Z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </>
  ),
  briefcase: (
    <>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <rect x="3" y="6" width="18" height="15" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 12v2" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </>
  ),
  tasks: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M8 2v5" />
      <path d="M16 2v5" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2.5 14.2 8l5.8 2-5.8 2-2.2 5.5L9.8 12 4 10l5.8-2L12 2.5Z" />
      <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
    </>
  ),
  community: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M3.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M11.5 19a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  notes: (
    <>
      <path d="M5 3h10l4 4v14H5V3Z" />
      <path d="M15 3v5h5" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13 16 9" />
      <path d="M9 2h6" />
      <path d="M12 2v3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  brain: (
    <>
      <path d="M8.5 8.3a3.2 3.2 0 0 1 6.2-1.1A3 3 0 0 1 19 10a3 3 0 0 1-.9 2.1A3.4 3.4 0 0 1 15 19h-1.2" />
      <path d="M9.6 19H9a4 4 0 0 1-2.9-6.8A3 3 0 0 1 8.5 8.3" />
      <path d="M12 6.5V21" />
      <path d="M8 12h4" />
      <path d="M12 15h4" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z" />
      <path d="M4 5.5V22" />
      <path d="M8 7h8" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
    </>
  ),
  certificate: (
    <>
      <path d="M6 3h12v10a6 6 0 0 1-12 0V3Z" />
      <path d="M9 21v-4" />
      <path d="M15 21v-4" />
      <path d="m9 8 2 2 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  rocket: (
    <>
      <path d="M14 4c2.9 1 5 3.7 6 6.8-2.4.4-4.5 1.5-6 3.2-1.7 1.5-2.8 3.6-3.2 6C7.7 19 5 16.9 4 14c2.1-.7 3.7-1.8 5-3s2.3-2.9 3-5Z" />
      <path d="M14 4 9 9" />
      <path d="M5 19c-1 1-2 1.5-3 1 0-1 .5-2 1.5-3" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7V5Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 6-3 8h18c0-2-3-1-3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  map: (
    <>
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </>
  )
};

const baseUrl = import.meta.env.BASE_URL || "/";

const navItems: Array<{ label: string; href: string; icon: IconName; dropdown?: boolean }> = [
  { label: "Produto", href: "#produto", icon: "stack", dropdown: true },
  { label: "Recursos", href: "#recursos", icon: "gift", dropdown: true },
  { label: "Comunidade", href: "#comunidade", icon: "users" },
  { label: "Planos", href: "#planos", icon: "card" },
  { label: "Carreira", href: "#carreira", icon: "briefcase" }
];

const heroTools: Array<{ label: string; icon: IconName; tone: Tone }> = [
  { label: "Notas", icon: "notes", tone: "blue" },
  { label: "Tarefas", icon: "tasks", tone: "red" },
  { label: "IA", icon: "spark", tone: "purple" },
  { label: "Comunidade", icon: "community", tone: "green" },
  { label: "Calendário", icon: "calendar", tone: "yellow" },
  { label: "Carreira", icon: "briefcase", tone: "blue" }
];

const sidebarItems: Array<{ label: string; icon: IconName }> = [
  { label: "Início", icon: "home" },
  { label: "Agenda", icon: "calendar" },
  { label: "Tarefas", icon: "tasks" },
  { label: "Notas", icon: "notes" },
  { label: "Pomodoro", icon: "timer" },
  { label: "Metas", icon: "target" },
  { label: "IA Assistente", icon: "spark" },
  { label: "Simulados", icon: "chart" },
  { label: "Comunidade", icon: "community" },
  { label: "Carreira", icon: "briefcase" }
];

const stats = [
  { value: "3", label: "Tarefas hoje" },
  { value: "2h 30m", label: "Tempo de foco" },
  { value: "1", label: "Aula / Prova" },
  { value: "85%", label: "Meta diária", accent: true }
];

const schedule = [
  { subject: "Matemática", time: "14:00 - 15:30", label: "Aula", tone: "blue" as Tone },
  { subject: "História", time: "16:00 - 17:30", label: "Entrega", tone: "red" as Tone },
  { subject: "Física", time: "19:00 - 20:30", label: "Foco", tone: "green" as Tone }
];

const aiActions = ["Resumir PDF", "Criar cronograma", "Gerar questões", "Explicar conceito"];

const partners = ["Universidade Alpha", "Instituto Beta", "Escola Next", "Campus Digital", "EduLab", "Future Academy"];

const productSteps: Array<{ title: string; description: string; icon: IconName; tone: Tone }> = [
  {
    title: "Reúna",
    description: "Aulas, PDFs, tarefas, provas e dúvidas entram no mesmo ambiente.",
    icon: "file",
    tone: "blue"
  },
  {
    title: "Planeje",
    description: "Prazos viram agenda, prioridades, Pomodoro e metas executáveis.",
    icon: "calendar",
    tone: "purple"
  },
  {
    title: "Aprenda",
    description: "A IA cria resumos, revisões, questões, flashcards e explicações.",
    icon: "brain",
    tone: "red"
  },
  {
    title: "Evolua",
    description: "Seu progresso vira histórico, portfólio e oportunidades de carreira.",
    icon: "rocket",
    tone: "green"
  }
];

const features: Array<{ title: string; description: string; icon: IconName; tone: Tone }> = [
  {
    title: "Notas que viram revisão",
    description: "Guarde aulas, resumos e ideias em um espaço organizado para revisar quando precisar.",
    icon: "notes",
    tone: "blue"
  },
  {
    title: "Calendário acadêmico",
    description: "Veja provas, trabalhos, revisões e aulas em uma rotina simples de acompanhar.",
    icon: "calendar",
    tone: "purple"
  },
  {
    title: "Tarefas inteligentes",
    description: "Priorize o que importa e transforme prazos em ações claras para hoje.",
    icon: "tasks",
    tone: "green"
  },
  {
    title: "Metas e hábitos",
    description: "Acompanhe consistência, evolução por matéria e objetivos de longo prazo.",
    icon: "target",
    tone: "yellow"
  },
  {
    title: "Pomodoro integrado",
    description: "Conecte ciclos de foco às matérias, tarefas e revisões certas.",
    icon: "timer",
    tone: "red"
  },
  {
    title: "IA contextual",
    description: "Resumos, planos, exercícios e explicações baseados na sua rotina real.",
    icon: "spark",
    tone: "purple"
  },
  {
    title: "Simulados e desempenho",
    description: "Pratique com questões, identifique pontos fracos e acompanhe evolução.",
    icon: "chart",
    tone: "blue"
  },
  {
    title: "Comunidade ativa",
    description: "Entre em grupos, tire dúvidas e aprenda com estudantes do mesmo caminho.",
    icon: "community",
    tone: "green"
  }
];

const communities = [
  {
    name: "ENEM",
    members: "23.118",
    description: "Redação, simulados e plano de revisão.",
    event: "Correção de redação às 19h",
    online: "+527 online",
    tone: "yellow" as Tone
  },
  {
    name: "Programação",
    members: "18.430",
    description: "Projetos, desafios e revisão de código.",
    event: "Desafio React aberto",
    online: "+418 online",
    tone: "blue" as Tone
  },
  {
    name: "Concursos",
    members: "15.209",
    description: "Editais, cronogramas e questões comentadas.",
    event: "Simulado semanal liberado",
    online: "+312 online",
    tone: "purple" as Tone
  }
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a organizar a rotina sem custo.",
    features: ["Notas e tarefas", "Calendário de estudos", "Pomodoro", "Comunidades públicas"],
    cta: "Começar grátis"
  },
  {
    name: "Pro",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para acelerar foco, desempenho e evolução com IA.",
    features: ["Tudo do Free", "IA de estudos", "Simulados e desempenho", "Metas avançadas"],
    cta: "Assinar Pro",
    featured: true
  },
  {
    name: "Campus",
    price: "Sob consulta",
    period: "",
    description: "Para escolas, faculdades, cursos e instituições.",
    features: ["Tudo do Pro", "Painel para turmas", "Relatórios de evolução", "Suporte dedicado"],
    cta: "Falar com vendas"
  }
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className={compact ? "logo-mark compact" : "logo-mark"} href="#produto" aria-label="Ir para o início">
      <img src={`${baseUrl}img/logo.png`} alt="Px" width="64" height="64" decoding="async" />
      <span className="logo-fallback" aria-hidden="true"><strong>P</strong><em>x</em></span>
    </a>
  );
}

const Header = memo(function Header() {
  return (
    <header className="header-shell" aria-label="Cabeçalho principal">
      <div className="header-bar">
        <LogoMark compact />

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a key={item.label} className="nav-link" href={item.href}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.dropdown ? <Icon name="chevron" className="nav-chevron" /> : null}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="login-link" href="#acesso">Entrar</a>
          <a className="button button-primary header-cta" href="#acesso">Começar grátis</a>
        </div>
      </div>
    </header>
  );
});

function HeroTools() {
  return (
    <div className="hero-tools" aria-label="Recursos principais">
      {heroTools.map((tool) => (
        <div className={`tool-orb tone-${tool.tone}`} key={tool.label}>
          <Icon name={tool.icon} />
          <span>{tool.label}</span>
        </div>
      ))}
    </div>
  );
}

function SocialProof() {
  return (
    <div className="social-proof" aria-label="Prova social">
      <div className="avatar-row" aria-hidden="true">
        {['G', 'A', 'L', 'M', 'R'].map((item, index) => (
          <span className={`avatar avatar-${index}`} key={item}>{item}</span>
        ))}
      </div>
      <div className="proof-copy">
        <div className="rating"><span>★★★★★</span><strong>Beta aberto</strong></div>
        <p>Criado para estudantes que querem estudar melhor, se organizar e construir o futuro.</p>
      </div>
    </div>
  );
}

const ProductMockup = memo(function ProductMockup() {
  return (
    <section className="product-mockup" id="demo" aria-label="Demonstração do produto">
      <aside className="mockup-sidebar" aria-label="Menu do aplicativo">
        <LogoMark compact />
        <div className="sidebar-menu">
          {sidebarItems.map((item, index) => (
            <span className={index === 0 ? "sidebar-item active" : "sidebar-item"} key={item.label}>
              <Icon name={item.icon} />
              {item.label}
            </span>
          ))}
        </div>
      </aside>

      <div className="mockup-main">
        <div className="mockup-topbar">
          <div>
            <h2>Olá, estudante! 👋</h2>
            <p>Foque no que importa e deixe o resto com a Px.</p>
          </div>
          <div className="topbar-icons" aria-hidden="true">
            <Icon name="search" />
            <Icon name="bell" />
            <span className="user-photo">J</span>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Resumo de hoje</h3>
          <div className="stat-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong className={stat.accent ? "success" : ""}>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-grid">
          <article className="panel-card schedule-card">
            <div className="panel-title-row">
              <h3>Plano de hoje</h3>
              <a href="#recursos">Ver agenda completa</a>
            </div>
            <div className="schedule-list">
              {schedule.map((item) => (
                <div className={`schedule-item tone-${item.tone}`} key={item.subject}>
                  <span className="schedule-line" />
                  <div>
                    <strong>{item.subject}</strong>
                    <p>{item.time}</p>
                  </div>
                  <span className="tag">{item.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel-card pomodoro-card">
            <h3>Pomodoro</h3>
            <div className="timer-ring" aria-label="Pomodoro 25 minutos">
              <span>25:00</span>
              <small>Foco</small>
            </div>
            <button className="mini-button" type="button">Iniciar</button>
          </article>

          <article className="panel-card career-card-mini">
            <h3>Carreira</h3>
            <p>Seu perfil está 72% completo</p>
            <div className="progress-track"><span style={{ width: "72%" }} /></div>
            <p>Complete para receber melhores oportunidades.</p>
            <a href="#carreira">Ver meu perfil</a>
          </article>
        </div>

        <article className="ai-assistant-card">
          <div className="ai-title"><Icon name="spark" /><strong>IA Assistente</strong></div>
          <p>Como posso ajudar nos seus estudos hoje?</p>
          <div className="ai-actions">
            {aiActions.map((action) => <button type="button" key={action}>{action}</button>)}
            <button className="send-button" type="button" aria-label="Enviar"><Icon name="send" /></button>
          </div>
        </article>
      </div>
    </section>
  );
});

const Hero = memo(function Hero() {
  return (
    <section className="hero-section" id="produto">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-badge"><Icon name="spark" />O sistema operacional do estudante</div>
          <HeroTools />

          <h1>
            <span>Onde estudantes</span>
            <span>aprendem, se</span>
            <span>organizam e</span>
            <span className="highlight-line"><i /> evoluem.</span>
          </h1>

          <p className="hero-subtitle">
            Notas, tarefas, calendário, metas, Pomodoro, comunidade e IA para estudantes que querem aprender melhor e construir o futuro.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#acesso">Começar gratuitamente <span aria-hidden="true">→</span></a>
            <a className="button button-secondary" href="#demo">Ver demonstração <Icon name="play" /></a>
          </div>

          <SocialProof />
        </div>

        <ProductMockup />
      </div>

      <TrustStrip />
    </section>
  );
});

function TrustStrip() {
  return (
    <div className="container trust-strip">
      <p>Utilizado por estudantes e instituições que acreditam no futuro da educação</p>
      <div className="partner-row" aria-label="Instituições parceiras fictícias">
        {partners.map((partner, index) => (
          <span key={partner}><Icon name={index % 2 === 0 ? "shield" : "stack"} />{partner}</span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function ProductSystem() {
  return (
    <section className="section product-system" id="sistema">
      <div className="container">
        <SectionHeader
          eyebrow="Como funciona"
          title="Um fluxo, não dez aplicativos soltos."
          description="A Px transforma a bagunça acadêmica em uma rotina de execução: reúna, planeje, aprenda e evolua."
        />
        <div className="steps-grid">
          {productSteps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <div className={`icon-box tone-${step.tone}`}><Icon name={step.icon} /></div>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section features-section" id="recursos">
      <div className="container">
        <SectionHeader
          eyebrow="Recursos"
          title="Tudo que você precisa para estudar melhor."
          description="Ferramentas conectadas para transformar intenção em rotina, rotina em progresso e progresso em oportunidade."
        />
        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className={`icon-box tone-${feature.tone}`}><Icon name={feature.icon} /></div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="section community-section" id="comunidade">
      <div className="container split-section">
        <div>
          <span className="eyebrow">Comunidade</span>
          <h2>Aprender junto é mais poderoso.</h2>
          <p>
            Encontre estudantes com os mesmos objetivos, participe de grupos ativos, tire dúvidas e evolua com quem está na mesma jornada.
          </p>
          <a className="text-link" href="#acesso">Conhecer comunidade →</a>
        </div>
        <div className="community-grid">
          {communities.map((community) => (
            <article className={`community-card tone-${community.tone}`} key={community.name}>
              <div className="community-top">
                <div className={`icon-box tone-${community.tone}`}><Icon name="community" /></div>
                <span>Ativo</span>
              </div>
              <h3>{community.name}</h3>
              <strong>{community.members} membros</strong>
              <p>{community.description}</p>
              <small>{community.online}</small>
              <em>{community.event}</em>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="section ai-section" id="ia">
      <div className="container ai-card-large">
        <div>
          <span className="eyebrow">Inteligência artificial</span>
          <h2>Uma IA que entende sua rotina de estudos.</h2>
          <p>
            A Px conecta suas tarefas, provas, metas e anotações para criar planos personalizados, resumos inteligentes, revisões automáticas e exercícios baseados no que você precisa aprender agora.
          </p>
          <a className="button button-primary" href="#acesso">Experimentar IA</a>
        </div>
        <div className="ai-example-stack">
          {[
            ["Prova de Física em 7 dias", "Plano criado com 6 blocos de estudo e 2 revisões."],
            ["PDF de Biologia enviado", "Resumo, flashcards e 12 questões gerados."],
            ["Meta atrasada", "Agenda reorganizada para recuperar consistência."]
          ].map(([title, text]) => (
            <article className="ai-example" key={title}>
              <Icon name="spark" />
              <div><strong>{title}</strong><p>{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareerSection() {
  return (
    <section className="section career-section" id="carreira">
      <div className="container career-layout">
        <div className="career-copy">
          <span className="eyebrow">Carreira</span>
          <h2>Do estudo à carreira.</h2>
          <p className="career-thesis">Seu estudo vira histórico. Seu histórico vira portfólio. Seu portfólio vira oportunidade.</p>
          <p>
            A camada de carreira transforma evolução acadêmica em sinais úteis para estágios, bolsas, mentorias, vagas e trilhas profissionais.
          </p>
          <div className="hero-actions compact-actions">
            <a className="button button-primary" href="#acesso">Criar perfil</a>
            <a className="button button-secondary" href="#recursos">Ver trilhas</a>
          </div>
        </div>
        <article className="career-profile-card">
          <div className="profile-top">
            <span className="profile-avatar">A</span>
            <div>
              <h3>Ana Clara</h3>
              <p>Estudante de Engenharia</p>
            </div>
            <strong>72%</strong>
          </div>
          <div className="skill-list">
            {[
              ["Raciocínio lógico", "88%"],
              ["Gestão de tempo", "76%"],
              ["Comunicação escrita", "69%"]
            ].map(([name, value]) => (
              <div className="skill-item" key={name}>
                <span>{name}</span><strong>{value}</strong>
                <div className="progress-track"><span style={{ width: value }} /></div>
              </div>
            ))}
          </div>
          <div className="opportunity-card">
            <span>Oportunidade recomendada</span>
            <strong>Estágio em tecnologia educacional</strong>
            <small>Compatibilidade: 91%</small>
          </div>
        </article>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section pricing-section" id="planos">
      <div className="container">
        <SectionHeader
          eyebrow="Planos"
          title="Comece simples. Evolua conforme sua rotina cresce."
          description="Plano gratuito para validar o hábito e planos pagos para quem quer acelerar aprendizado, IA e desempenho."
        />
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={plan.featured ? "plan-card featured" : "plan-card"} key={plan.name}>
              {plan.featured ? <span className="popular-badge">Mais popular</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="price-line"><strong>{plan.price}</strong><span>{plan.period}</span></div>
              <ul>
                {plan.features.map((item) => <li key={item}><Icon name="check" />{item}</li>)}
              </ul>
              <a className={plan.featured ? "button button-primary" : "button button-secondary"} href="#acesso">{plan.cta}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section final-cta-section" id="acesso">
      <div className="container final-cta">
        <div className="cta-orb"><Icon name="rocket" /></div>
        <div>
          <span>Próximo passo</span>
          <h2>Pronto para transformar sua rotina de estudos?</h2>
          <p>Entre na lista beta e ajude a construir o novo sistema operacional do estudante.</p>
        </div>
        <form className="waitlist-form" aria-label="Lista beta">
          <input type="email" placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" />
          <button type="submit">Entrar na lista</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <LogoMark compact />
          <p>O ecossistema completo para estudantes aprenderem, se organizarem e evoluírem.</p>
        </div>
        {[
          ["Produto", "Visão geral", "Demonstração", "Planos"],
          ["Recursos", "Notas", "IA", "Comunidade"],
          ["Empresa", "Sobre", "Carreira", "Contato"]
        ].map(([title, ...links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map((link) => <a href="#produto" key={link}>{link}</a>)}
          </div>
        ))}
      </div>
    </footer>
  );
}

export const Home = memo(function Home() {
  return (
    <main className="px-page">
      <Header />
      <Hero />
      <ProductSystem />
      <Features />
      <Community />
      <AISection />
      <CareerSection />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
});

export default Home;
