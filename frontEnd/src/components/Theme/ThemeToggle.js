import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  // Carrega o tema salvo no localStorage ou usa light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

export default ThemeToggle;
