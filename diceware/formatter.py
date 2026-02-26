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

    # 2) Inserção de caracteres do pool de números (distribuídos de forma única)
    if num_count > 0 and numbers_pool:
        # Pega os caracteres que serão usados. Se o pool for menor que num_count, 
        # (embora no frontend sejam iguais), usamos o que tem.
        available_chars = list(numbers_pool)
        # Embaralhamos para que a ordem mude a cada geração
        secrets.SystemRandom().shuffle(available_chars)
        
        # Selecionamos quais palavras receberão os caracteres (limitado ao n de palavras)
        target_indices = secure_sample(range(n), min(len(available_chars), n))
        
        for idx, char in zip(target_indices, available_chars):
            if secrets.choice([True, False]):
                w[idx] = char + w[idx]
            else:
                w[idx] = w[idx] + char

    # 3) Inserção de caracteres do pool de símbolos (distribuídos de forma única)
    if sym_count > 0 and symbols_pool:
        available_syms = list(symbols_pool)
        secrets.SystemRandom().shuffle(available_syms)
        
        # Selecionamos quais palavras receberão os símbolos
        target_indices = secure_sample(range(n), min(len(available_syms), n))
        
        for idx, char in zip(target_indices, available_syms):
            if secrets.choice([True, False]):
                w[idx] = char + w[idx]
            else:
                w[idx] = w[idx] + char

    return (sep if sep is not None else "-").join(w)
