"""
Gerador de Senhas — API FastAPI.

Endpoints:
  GET  /api/generators        → lista geradores disponíveis
  POST /api/generate          → gera senha com opções
  GET  /api/entries           → histórico
  DELETE /api/entries/{id}    → exclui entrada
  PATCH  /api/entries/{id}    → atualiza tag
"""

from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.history import HistoryManager
from password_generators import get_generators
from config import DICEWARE_DB_DIR, DICEWARE_LANG_FILES
from diceware.loader import load_diceware_file

# ---------------------------------------------------------------------------
# App & Config
# ---------------------------------------------------------------------------

app = FastAPI(title="Gerador de Senhas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# History — caminho relativo à raiz do projeto
history_manager = HistoryManager("history.json")

# ---------------------------------------------------------------------------
# Logic / State
# ---------------------------------------------------------------------------


def _load_wordlists() -> dict:
    """Carrega todas as listas Diceware configuradas."""
    data = {}
    for lang, fname in DICEWARE_LANG_FILES.items():
        path = DICEWARE_DB_DIR / fname
        if path.exists():
            data[lang] = load_diceware_file(path)
    return data


wordlists = _load_wordlists()
_app_context = {"wordlists": wordlists}
_generators_list = get_generators(_app_context)
_generators_map = {g.id: g for g in _generators_list}

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class EntryResponse(BaseModel):
    id: str
    timestamp: str
    mode: str
    password: str
    tag: str = ""


class UpdateTagRequest(BaseModel):
    tag: str


class GenerateRequest(BaseModel):
    generator_id: str
    options: Dict[str, Any] = {}


class GenerateResponse(BaseModel):
    password: str
    entropy: float
    entropy_label: str


# ---------------------------------------------------------------------------
# Endpoints: History
# ---------------------------------------------------------------------------


@app.get("/api/entries", response_model=List[EntryResponse])
def list_entries():
    return history_manager.get_entries()


@app.delete("/api/entries/{entry_id}")
def delete_entry(entry_id: str):
    try:
        history_manager.delete_entry(entry_id)
        return {"status": "deleted"}
    except KeyError:
        raise HTTPException(status_code=404, detail="Entrada não encontrada.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/api/entries/{entry_id}")
def update_entry_tag(entry_id: str, req: UpdateTagRequest):
    try:
        history_manager.update_tag(entry_id, req.tag)
        return {"status": "updated"}
    except KeyError:
        raise HTTPException(status_code=404, detail="Entrada não encontrada.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# Endpoints: Generator
# ---------------------------------------------------------------------------


@app.get("/api/generators")
def list_generators():
    return [
        {"id": g.id, "name": g.id.replace("_", " ").title()}
        for g in _generators_list
    ]


@app.post("/api/generate", response_model=GenerateResponse)
def generate_password(req: GenerateRequest):
    gen = _generators_map.get(req.generator_id)
    if not gen:
        raise HTTPException(status_code=404, detail="Gerador não encontrado.")

    # Configura o gerador através do método seguro
    gen.configure(req.options)

    try:
        result = gen.generate()
    except RuntimeError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Auto-save no histórico
    history_manager.add_entry(result.value, req.generator_id)

    # Classificação de entropia
    if result.entropy_bits >= 120:
        label = "Altíssima"
    elif result.entropy_bits >= 80:
        label = "Alta"
    elif result.entropy_bits >= 60:
        label = "Razoável"
    elif result.entropy_bits >= 40:
        label = "Média"
    else:
        label = "Baixa"

    return GenerateResponse(
        password=result.value,
        entropy=result.entropy_bits,
        entropy_label=label,
    )


# ---------------------------------------------------------------------------
# Entrypoint direto (desenvolvimento)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
