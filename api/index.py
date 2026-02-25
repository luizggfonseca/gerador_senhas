"""
Gerador de Senhas — API FastAPI.

Endpoints:
  GET  /api/generators        → lista geradores disponíveis
  POST /api/generate          → gera senha com opções
"""

from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


class GenerateRequest(BaseModel):
    generator_id: str
    options: Dict[str, Any] = {}


class GenerateResponse(BaseModel):
    password: str
    entropy: float
    entropy_label: str


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

    # Classificação de entropia (v3.0 - Alinhada com Legenda)
    bits = result.entropy_bits
    if bits >= 128:
        label = "Impossível"
    elif bits >= 103:
        label = "Altíssima"
    elif bits >= 80:
        label = "Alta"
    elif bits >= 50:
        label = "Média"
    elif bits >= 30:
        label = "Baixa"
    else:
        label = "Baixíssima"

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
