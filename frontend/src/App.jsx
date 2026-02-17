import Generator from './components/Generator';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <h1 className="app-title">Gerador de Senhas</h1>
          <p className="app-subtitle">Crie senhas fortes e seguras localmente.</p>
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
