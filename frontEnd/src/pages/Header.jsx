import { useState } from 'react';

function Header({ handleScrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMenuOpen(!menuOpen);

  const handleNavClick = (sectionId, redirect = false) => {
    handleScrollToSection(sectionId);
    if (redirect) window.location.href = '/';
    setMenuOpen(false); // fecha menu mobile ao clicar
  };

  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src="/logo.png" alt="FrancosCorp Logo" className="logo-img" />
        </div>

        {/* Nav */}
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li>
              <button className="nav-button" onClick={() => handleNavClick('home', true)}>
                Home
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => handleNavClick('about')}>
                Sobre
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => handleNavClick('services')}>
                Serviços
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => handleNavClick('contact')}>
                Contato
              </button>
            </li>
            <li>
              <button className="nav-button login" onClick={() => window.location.href = '/login'}>
                Login
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <div className="mobile-menu" onClick={toggleMobileMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
