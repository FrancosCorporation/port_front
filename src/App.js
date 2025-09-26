// src/App.jsx
import './App.css';
import ContactForm from './ContactForm';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="logo.png" alt="FrancosCorp Logo" className="logo-img" />
          </div>
          <nav className="nav">
            <ul className="nav-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#services">Serviços</a></li>
              <li><a href="#contact">Contato</a></li>
            </ul>
          </nav>
          <div className="mobile-menu">☰</div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <h1 className="hero-title">Bem-vindo à FrancosCorp</h1>
          <p className="hero-subtitle">Líderes em soluções de tecnologia inovadoras para o futuro digital.</p>
          <button className="cta-button">Saiba Mais</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">Sobre Nós</h2>
          <p className="section-text">
            A FrancosCorp é uma empresa de tecnologia dedicada a desenvolver soluções personalizadas em software, IA e cloud computing. 
            Com mais de 10 anos de experiência, ajudamos empresas a crescerem no mundo digital.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Desenvolvimento Web</h3>
              <p>Sites e apps responsivos em React e mais.</p>
            </div>
            <div className="service-card">
              <h3>Inteligência Artificial</h3>
              <p>Soluções de IA para automação e análise de dados.</p>
            </div>
            <div className="service-card">
              <h3>Cloud Computing</h3>
              <p>Migração e gerenciamento de infraestrutura em nuvem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Entre em Contato</h2>
          <p className="section-text">Envie uma mensagem para discutirmos seu projeto.</p>
          
          {/* Formulário modularizado */}
          <ContactForm />
          
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 FrancosCorp. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
