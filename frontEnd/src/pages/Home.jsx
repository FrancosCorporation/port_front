import ContactForm from '../forms/ContactForm'; // Assumindo que existe; use o placeholder se não tiver
import './Home.css';
import Header from './Header'
function App() {
  // Função básica para scroll suave ao clicar nos botões do nav
  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      {/* Header */}
      <Header handleScrollToSection={handleScrollToSection} />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <h1 className="hero-title">FrancosCorp</h1>
          <p className="hero-subtitle">Líderes em soluções de tecnologia inovadoras para o futuro digital. Transformamos ideias em realidade com expertise em software, IA e cloud.</p>
          <button className="cta-button" onClick={() => handleScrollToSection('services')}>
            <i className="fas fa-rocket"></i> Saiba Mais
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title"><i className="fas fa-info-circle"></i> Sobre Nós</h2>
          <p className="section-text">
            A FrancosCorp é uma empresa de tecnologia dedicada a desenvolver soluções personalizadas em software, inteligência artificial e cloud computing.
            Com mais de 10 anos de experiência, ajudamos empresas de todos os tamanhos a crescerem no mundo digital, oferecendo inovação acessível e resultados mensuráveis.
          </p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="cta-button secondary" onClick={() => handleScrollToSection('contact')}>
              <i className="fas fa-envelope"></i> Entre em Contato
            </button>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title"><i className="fas fa-cogs"></i> Nossos Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <i className="fas fa-code service-icon"></i>
              <h3>Desenvolvimento Web</h3>
              <p>Sites e aplicativos web responsivos construídos com tecnologias modernas como React, Node.js e mais. Focamos em performance e UX intuitiva.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-brain service-icon"></i>
              <h3>Inteligência Artificial</h3>
              <p>Soluções de IA personalizadas para automação, análise de dados e machine learning. Integramos ferramentas como TensorFlow para resultados precisos.</p>
            </div>
            <div className="service-card">
              <i className="fas fa-cloud service-icon"></i>
              <h3>Cloud Computing</h3>
              <p>Migração segura para a nuvem (AWS, Azure, Google Cloud) e gerenciamento de infraestrutura escalável. Otimizamos custos e segurança.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title"><i className="fas fa-envelope"></i> Entre em Contato</h2>
          <p className="section-text">Envie uma mensagem para discutirmos seu projeto. Nossa equipe está pronta para ajudar!</p>

          {/* Formulário modularizado */}
          <ContactForm />

          {/* Botão de Login ADICIONADO AQUI, DEPOIS DO CONTATO */}

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 FrancosCorp. Todos os direitos reservados. | <button className="footer-link" onClick={() => handleScrollToSection('home')}>Voltar ao Topo</button></p>
        </div>
      </footer>
    </div>
  );
}



export default App;
