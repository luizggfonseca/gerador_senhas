import { useState, useEffect } from 'react';
import Generator from './components/Generator';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [uiSize, setUiSize] = useState(() => localStorage.getItem('uiSize') || 'desktop');

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light-theme');
    else root.classList.remove('light-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist UI Size
  useEffect(() => {
    localStorage.setItem('uiSize', uiSize);
  }, [uiSize]);

  return (
    <div className={`app-container ${uiSize === 'mobile' ? 'ui-mobile' : ''}`}>
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Gerador de Senhas</h1>
            <p className="app-subtitle">Crie senhas fortes e seguras localmente.</p>
          </div>
          
          <div className="app-controls">
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

            {/* Size Toggle */}
            <button 
              className="control-btn" 
              onClick={() => setUiSize(s => s === 'desktop' ? 'mobile' : 'desktop')}
              title={uiSize === 'desktop' ? 'Visualizar como Celular' : 'Visualizar como PC'}
            >
              {uiSize === 'desktop' ? (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
    </div>
  );
}

export default App;
