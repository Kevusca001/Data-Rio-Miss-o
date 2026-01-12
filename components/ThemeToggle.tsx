
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-gray-200 dark:bg-nexus-panel border border-gray-300 dark:border-nexus-border text-gray-700 dark:text-nexus-yellow hover:scale-110 transition-all shadow-sm"
      aria-label="Alternar Tema"
      title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
    >
      {theme === 'light' ? (
        <Moon size={18} fill="currentColor" className="opacity-80" />
      ) : (
        <Sun size={18} fill="currentColor" className="opacity-80" />
      )}
    </button>
  );
};

export default ThemeToggle;
