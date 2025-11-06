import { useState } from 'react';
import { useTheme } from '../components/Theme/ThemeProvider'; // 👈 importa o hook

function Header({ handleScrollToSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { appearance, toggleTheme } = useTheme(); // 👈 acesso ao tema atual

  const toggleMobileMenu = () => setMenuOpen(!menuOpen);

  const handleNavClick = (sectionId) => {
    handleScrollToSection(sectionId);
    setMenuOpen(false);
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

            {/* Botão de tema */}
            <li>
              <button
                className="nav-button"
                onClick={toggleTheme}
                title="Alternar tema"
              >
                {appearance === 'light' ? (
                  <i className="fas fa-moon"></i>
                ) : (
                  <i className="fas fa-sun"></i>
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* Menu mobile */}
        <div className="mobile-menu" onClick={toggleMobileMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
