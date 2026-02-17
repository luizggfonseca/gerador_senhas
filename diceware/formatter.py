import secrets
import string
from typing import Dict, List
from core.utils import secure_sample

DEFAULT_SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?"


def format_pure(words: List[str], separator: str = "-") -> str:
    return (separator if separator is not None else "-").join(words)


def format_modified(words: List[str], config: Dict) -> str:
    """
    config:
      separator: str
      capitalize_count: int (qtd de palavras para capitalizar)
      force_uppercase: bool (se True, transforma todas as palavras em MAIÚSCULAS, ignorando capitalize_count)
      num_numbers: int
      num_symbols: int
      numbers_pool: str
      symbols_pool: str
      avoid_overlap: bool
    """
    if not words:
        return ""

    w = list(words)
    n = len(w)

    sep = config.get("separator", "-")
    cap_count = int(config.get("capitalize_count", 0))
    force_upper = bool(config.get("force_uppercase", False))
    num_count = int(config.get("num_numbers", 0))
    sym_count = int(config.get("num_symbols", 0))
    
    numbers_pool = config.get("numbers_pool", string.digits)
    # Ensure pool isn't empty if we need numbers
    if not numbers_pool: numbers_pool = string.digits

    symbols_pool = config.get("symbols_pool", DEFAULT_SYMBOLS)
    if not symbols_pool: symbols_pool = DEFAULT_SYMBOLS

    avoid_overlap = bool(config.get("avoid_overlap", True))

    # 1) Case Transformations
    if force_upper:
        w = [word.upper() for word in w]
    elif cap_count > 0:
        for i in secure_sample(range(n), min(cap_count, n)):
            w[i] = w[i].capitalize()

    used_num = set()

    # 2) Números no início ou fim
    if num_count > 0:
        for i in secure_sample(range(n), min(num_count, n)):
            used_num.add(i)
            # FIX: Use configured numbers_pool instead of hardcoded string.digits
            d = secrets.choice(numbers_pool)
            if secrets.choice([True, False]):
                w[i] = d + w[i]
            else:
                w[i] = w[i] + d

    # 3) Símbolos (evita sobrepor com palavras que já receberam números, se desejado)
    indices = list(range(n))
    if avoid_overlap:
        indices = [i for i in indices if i not in used_num]

    if sym_count > 0 and indices:
        for i in secure_sample(indices, min(sym_count, len(indices))):
            s = secrets.choice(symbols_pool)
            if secrets.choice([True, False]):
                w[i] = s + w[i]
            else:
                w[i] = w[i] + s

    return (sep if sep is not None else "-").join(w)
