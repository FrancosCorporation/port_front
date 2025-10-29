import { useState } from 'react';

function Header({ handleScrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMenuOpen(!menuOpen);

  const handleNavClick = (sectionId) => {
    handleScrollToSection(sectionId);
    setMenuOpen(false); // fecha menu mobile ao clicar
  };

  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src="/logo.png" alt="FrancosCorp Logo" className="logo-img" />
        </div>

        {/* Navegação */}
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            {['home', 'about', 'services', 'contact'].map((section) => (
              <li key={section}>
                <button
                  className="nav-button"
                  onClick={() => handleNavClick(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              </li>
            ))}
            <li>
              <button
                className="nav-button login"
                onClick={() => (window.location.href = '/login')}
              >
                Login
              </button>
            </li>
          </ul>
        </nav>

        {/* Botão mobile */}
        <div className="mobile-menu" onClick={toggleMobileMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
