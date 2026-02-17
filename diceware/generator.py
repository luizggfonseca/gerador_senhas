import secrets
from typing import Dict, List, Tuple


def roll_5d6_code() -> str:
    return "".join(str(secrets.randbelow(6) + 1) for _ in range(5))


def generate_passphrase(wordlist: Dict[str, str], num_words: int, mixed_mode: bool = False) -> Tuple[List[str], List[str]]:
    """
    Retorna (palavras, codigos).
    - mixed_mode=False: Diceware clássico (5d6) com fallback se lista não tiver todas combinações
    - mixed_mode=True: escolhe chaves existentes aleatoriamente (útil para mistura de idiomas)
    """
    if not wordlist:
        raise ValueError("Lista Diceware vazia.")
    if num_words <= 0:
        raise ValueError("num_words deve ser > 0.")

    keys = list(wordlist.keys())
    used = set()
    words: List[str] = []
    audit: List[str] = []

    num_words = min(num_words, len(keys))

    while len(words) < num_words:
        if mixed_mode:
            code = secrets.choice(keys)
        else:
            code = roll_5d6_code()
            if code not in wordlist:
                # fallback para listas incompletas
                code = secrets.choice(keys)

        if code in used:
            continue

        used.add(code)
        words.append(wordlist[code])
        audit.append(code)

    return words, audit
