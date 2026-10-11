import { useEffect, useRef, useState } from 'react';
import './App.css';
import ContactForm from './ContactForm';

const navigation = [
  { href: '#about', label: 'Sobre' },
  { href: '#services', label: 'O que faço' },
  { href: '#projects', label: 'Projetos' },
];

const services = [
  {
    number: '01',
    icon: 'web',
    title: 'Web e experiências digitais',
    description: 'Sites e interfaces responsivos, com navegação clara e atenção a quem usa.',
  },
  {
    number: '02',
    icon: 'systems',
    title: 'Sistemas e integrações',
    description: 'Aplicações e APIs que conectam informações e ajudam a organizar processos.',
  },
  {
    number: '03',
    icon: 'spark',
    title: 'Automação e inteligência artificial',
    description: 'Exploração de tecnologia para simplificar tarefas e abrir novas possibilidades.',
  },
];

function Icon({ name, className = '' }) {
  const shapes = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    web: <><rect height="15" rx="2" width="18" x="3" y="4" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
    systems: <><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    spark: <><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.4A5.8 5.8 0 0 0 19.3 4a5.4 5.4 0 0 0-.1-4S18 0 15 2a13.4 13.4 0 0 0-7 0C5 0 3.8 0 3.8 0a5.4 5.4 0 0 0-.1 4A5.8 5.8 0 0 0 2 8c0 5.8 3.5 7 6.8 7.4a3.4 3.4 0 0 0-1 2.7V22" transform="translate(2 1) scale(.9)" /></>,
    linkedin: <><path d="M5 9v10M5 5v.01M10 19v-6a4 4 0 0 1 8 0v6M10 9v10" /><rect height="18" rx="2" width="18" x="3" y="3" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {shapes[name]}
    </svg>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function closeOnHashChange() {
      setMenuOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('hashchange', closeOnHashChange);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('hashchange', closeOnHashChange);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <div className="container nav-container">
          <a aria-label="FrancosCorp — início" className="brand" href="#home">
          <span aria-hidden="true" className="brand-mark">FC</span>
          <span className="brand-wordmark"><strong>Francos</strong><span>Corporation</span></span>
        </a>

        <button
          ref={menuButtonRef}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>

        <nav aria-label="Navegação principal" className={`nav-menu${menuOpen ? ' is-open' : ''}`} id="primary-navigation">
          {navigation.map((item) => (
            <a className="nav-link" href={item.href} key={item.href}>{item.label}</a>
          ))}
          <a className="button button--small button--outline" href="#contact">
            Vamos conversar <Icon name="arrow" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function HeroArtwork() {
  return (
    <div aria-hidden="true" className="hero-art">
      <div className="hero-art__halo hero-art__halo--one" />
      <div className="hero-art__halo hero-art__halo--two" />
      <div className="hero-art__circuit">
        <span /><span /><span />
      </div>
      <div className="hero-card">
        <div className="hero-card__bar"><span /><span /><span /><i>FRANCOS / DIGITAL</i></div>
        <div className="hero-card__content">
          <span className="hero-card__label">IDEIA → EXPERIÊNCIA</span>
          <strong>Tecnologia com propósito.</strong>
          <div className="hero-card__steps"><span>Ouvir</span><i /><span>Construir</span><i /><span>Evoluir</span></div>
          <div className="hero-card__signal"><span /><span /><span /><span /><span /><span /><span /><span /></div>
        </div>
      </div>
      <span className="art-tag art-tag--top"><i /> Pensado para pessoas</span>
      <span className="art-tag art-tag--bottom"><Icon name="spark" /> Aberto a novas ideias</span>
    </div>
  );
}

function App() {
  return (
    <div className="App" id="top">
      <Header />
      <main id="main-content">
        <section aria-labelledby="hero-title" className="hero" id="home">
          <div aria-hidden="true" className="hero-grid" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="eyebrow"><span /> Tecnologia, criação e boas ideias</p>
              <h1 id="hero-title">Experiências digitais feitas para <span className="gradient-text">aproximar.</span></h1>
              <p className="hero-description">
                Sites, aplicações e soluções digitais com foco em clareza, utilidade e em quem está do outro lado da tela.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#services">Conheça o trabalho <Icon name="arrow" /></a>
                <a className="button button--quiet" href="#contact">Conte sua ideia</a>
              </div>
              <div className="hero-note"><span /> Desenvolvimento digital do conceito à entrega</div>
            </div>
            <HeroArtwork />
          </div>
          <a aria-label="Role para conhecer as frentes de trabalho" className="scroll-indicator" href="#services"><span /></a>
        </section>

        <section aria-labelledby="about-title" className="section about" id="about">
          <div className="container about-layout">
            <div>
              <p className="eyebrow eyebrow--light"><span /> Sobre a FrancosCorp</p>
              <h2 id="about-title">Tecnologia boa começa <span className="gradient-text">entendendo pessoas.</span></h2>
            </div>
            <div className="about-copy">
              <p>
                A FrancosCorp reúne projetos e experiências em desenvolvimento digital. O objetivo em cada trabalho é tornar ideias mais claras e soluções mais simples de usar.
              </p>
              <p>
                Da interface ao que acontece nos bastidores, cada decisão deve ajudar a resolver um problema real e criar uma experiência confiável.
              </p>
              <a className="text-link" href="https://github.com/FrancosCorporation" rel="noreferrer" target="_blank">
                Explore os projetos no GitHub <Icon name="arrow" />
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="services-title" className="section services" id="services">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow eyebrow--light"><span /> Frentes de trabalho</p>
              <h2 id="services-title">Ideias diferentes pedem <span className="gradient-text">soluções próprias.</span></h2>
              <p className="section-intro">Tecnologia escolhida pelo que ajuda a construir — com atenção ao contexto, aos detalhes e às pessoas.</p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <div className="service-card__top">
                    <span className="service-icon"><Icon name={service.icon} /></span>
                    <span className="service-number">{service.number}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span aria-hidden="true" className="service-card__rule" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="projects-title" className="section projects" id="projects">
          <div className="container projects-layout">
            <div className="projects-copy">
              <p className="eyebrow"><span /> Projetos e experimentos</p>
              <h2 id="projects-title">Código que vira <span className="gradient-text">possibilidade.</span></h2>
              <p>
                Cada projeto é uma oportunidade para aprender, resolver um desafio e transformar uma ideia em algo que as pessoas possam usar.
              </p>
              <a className="button button--primary" href="https://github.com/FrancosCorporation" rel="noreferrer" target="_blank">
                Ver projetos no GitHub <Icon name="arrow" />
              </a>
            </div>
            <div aria-hidden="true" className="project-board">
              <div className="project-board__top"><span>FRANCOSCORP / WORKSPACE</span><span>● ● ●</span></div>
              <div className="project-board__body">
                <div className="project-board__sidebar"><i /><i /><i /><i /></div>
                <div className="project-board__canvas">
                  <span className="project-board__caption">UM DESAFIO</span>
                  <strong>Curiosidade<br />em construção.</strong>
                  <div className="project-board__bars"><i /><i /><i /></div>
                  <div className="project-board__chips"><span>web</span><span>ideias</span><span>código</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="contact-title" className="section contact" id="contact">
          <div className="container contact-layout">
            <div className="contact-copy">
              <p className="eyebrow eyebrow--light"><span /> Próximo passo</p>
              <h2 id="contact-title">Tem uma ideia? <span className="gradient-text">Vamos conversar.</span></h2>
              <p>Conte um pouco sobre o que você está pensando. A conversa começa por aqui.</p>
              <div className="social-links">
                <a href="https://github.com/FrancosCorporation" rel="noreferrer" target="_blank"><Icon name="github" /> GitHub</a>
                <a href="https://www.linkedin.com/in/francoscorp/" rel="noreferrer" target="_blank"><Icon name="linkedin" /> LinkedIn</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <a className="brand brand--footer" href="#home">
            <span aria-hidden="true" className="brand-mark">FC</span>
            <span className="brand-wordmark"><strong>Francos</strong><span>Corporation</span></span>
          </a>
          <p>Ideias digitais com atenção a quem usa.</p>
          <span className="footer-copyright">© {new Date().getFullYear()} Francos Corporation</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
