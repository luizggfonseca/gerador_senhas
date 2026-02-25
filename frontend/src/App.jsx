import { useState, useEffect } from 'react';
import Generator from './components/Generator';
import ModalManual from './components/ModalManual';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isManualOpen, setIsManualOpen] = useState(false);

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light-theme');
    else root.classList.remove('light-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Gerador de Senhas</h1>
            <p className="app-subtitle">Crie senhas fortes e seguras localmente.</p>
          </div>

          <div className="app-controls">
            {/* Help Button - Modal Trigger */}
            <button
              onClick={() => setIsManualOpen(true)}
              className="control-btn"
              title="Ajuda e Documentação Técnica"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Theme Toggle */}
            <button
              className="control-btn"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <div className="glass-panel">
          <div className="glass-glow" />
          <div className="glass-inner">
            <Generator />
          </div>
        </div>

        <footer className="app-footer">
          &copy; 2026 SecureGen. Nenhuma senha sai do seu dispositivo.
        </footer>
      </div>

      <ModalManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
}

export default App;
