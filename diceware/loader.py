from pathlib import Path
from typing import Dict


def load_diceware_file(path: Path) -> Dict[str, str]:
    """
    Formato esperado por linha: 12345 palavra
    Retorna dict {codigo: palavra}.
    """
    wordlist: Dict[str, str] = {}

    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            parts = line.split()
            if len(parts) != 2:
                continue

            code, word = parts
            wordlist[code] = word

    return wordlist
