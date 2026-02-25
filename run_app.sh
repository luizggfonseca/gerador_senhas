#!/bin/bash
# ==========================================================================
# Gerador de Senhas — Script de inicialização (v2.0)
# Inicia o backend (FastAPI) e o frontend (Vite) de forma robusta.
# ==========================================================================

set -e

# Garante execução a partir da raiz do projeto
cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"

# ---------- Verificações ----------

if [ ! -d ".venv" ]; then
    echo "❌ Ambiente virtual não encontrado."
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependências do frontend não instaladas."
    exit 1
fi

# Limpeza agressiva de portas para evitar conflitos (CORS/Desencontro)
echo "🧹 Limpando processos antigos nas portas 8000, 5173 e 5174..."
for PORT in 8000 5173 5174; do
    PIDS=$(lsof -t -i:$PORT || true)
    if [ -n "$PIDS" ]; then
        echo "   Killing PIDs on port $PORT: $PIDS"
        kill -9 $PIDS 2>/dev/null || true
    fi
done

# ---------- Inicialização ----------

echo "🚀 Iniciando Backend API (Porta 8000)..."
# Redirecionando para um arquivo de log para debug se necessário
PYTHONPATH="$PROJECT_ROOT" .venv/bin/uvicorn backend.main:app --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!

# Aguarda o backend subir e valida
sleep 2
if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "❌ Falha crítica ao iniciar o backend. Verifique backend.log"
    cat backend.log
    exit 1
fi
echo "   ✅ Backend pronto."

echo "🎨 Iniciando Frontend (Porta 5173)..."
cd frontend
# Executa o Vite com --port 5173 --strictPort para garantir que use a porta correta para o CORS
npm run dev -- --host --port 5173 --strictPort

# Quando o frontend encerrar (Ctrl+C), encerra o backend
echo "🛑 Encerrando backend (PID: $BACKEND_PID)..."
kill "$BACKEND_PID" 2>/dev/null || true
echo "✅ Aplicação encerrada."
