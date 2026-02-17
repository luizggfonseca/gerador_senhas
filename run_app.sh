#!/bin/bash
# ==========================================================================
# Gerador de Senhas — Script de inicialização
# Inicia o backend (FastAPI) e o frontend (Vite) simultaneamente.
# ==========================================================================

set -e

# Garante execução a partir da raiz do projeto
cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"

# ---------- Verificações ----------

if [ ! -d ".venv" ]; then
    echo "❌ Ambiente virtual não encontrado. Crie com:"
    echo "   python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependências do frontend não instaladas. Rode:"
    echo "   cd frontend && npm install"
    exit 1
fi

if [ ! -d "banco_dados" ] || [ -z "$(ls banco_dados/*.txt 2>/dev/null)" ]; then
    echo "⚠️  Listas Diceware não encontradas em banco_dados/. O Diceware não funcionará."
fi

# Verifica se as portas estão livres
for PORT in 8000 5173; do
    if lsof -Pi :"$PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Porta $PORT já está em uso. Encerrando processo anterior..."
        kill "$(lsof -Pi :"$PORT" -sTCP:LISTEN -t)" 2>/dev/null || true
        sleep 1
    fi
done

# ---------- Inicialização ----------

echo "🚀 Iniciando Backend API em http://localhost:8000..."
PYTHONPATH="$PROJECT_ROOT" .venv/bin/uvicorn backend.main:app --port 8000 > /dev/null 2>&1 &
BACKEND_PID=$!

# Aguarda o backend subir
sleep 2
if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "❌ Falha ao iniciar o backend. Verifique as dependências Python."
    exit 1
fi

echo "🎨 Iniciando Frontend em http://localhost:5173..."
cd frontend
npm run dev -- --host

# Quando o frontend encerrar (Ctrl+C), encerra o backend
echo "🛑 Encerrando backend (PID: $BACKEND_PID)..."
kill "$BACKEND_PID" 2>/dev/null
echo "✅ Aplicação encerrada."
