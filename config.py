from pathlib import Path

APP_NAME = "Gerador de Senhas (Diceware + Aleatória + Tokens)"

PROJECT_ROOT = Path(__file__).resolve().parent
DICEWARE_DB_DIR = PROJECT_ROOT / "banco_dados"

# Requisito: mínimo 7 palavras e o app deve recusar menos
MIN_DICEWARE_WORDS = 7

DICEWARE_LANG_FILES = {
    "português": "portugues.txt",
    "espanhol": "espanhol.txt",
    "italiano": "italiano.txt",
    "francês": "frances.txt",
    "latim": "latim.txt",
    "inglês": "ingles.txt",
    "catalão": "catalao.txt",
}
