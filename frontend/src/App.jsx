import { useState, useEffect } from 'react';
import Generator from './components/Generator';
import ModalManual from './components/ModalManual';
import './App.css';

function App() {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">GhostPass</h1>
            <p className="app-subtitle">Crie senhas fortes e seguras localmente.</p>
          </div>

          <div className="app-controls">
            {/* Controles de cabeçalho podem ser adicionados aqui no futuro */}
          </div>
        </header>

        <div className="glass-panel">
          <div className="glass-glow" />
          <div className="glass-inner">
            <Generator />
          </div>
        </div>

        <footer className="app-footer">
          &copy; 2026 GhostPass. Senhas criadas localmente.
        </footer>
      </div>

      <ModalManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
}

export default App;
