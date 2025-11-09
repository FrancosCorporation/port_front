// ThemeProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@radix-ui/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [appearance, setAppearance] = useState('light');

  // Lê o tema salvo
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setAppearance(saved);
  }, []);

  // Salva o tema quando muda
  useEffect(() => {
    localStorage.setItem('theme', appearance);
  }, [appearance]);

  const toggleTheme = () => {
    setAppearance((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ appearance, toggleTheme }}>
      <Theme accentColor="indigo" grayColor="gray" radius="large" appearance={appearance}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
