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
    if mixed_mode or len(keys) < 7776:
        # Se for modo misto ou lista incompleta, pegamos direto das chaves
        # sem repetição usando sample (muito mais rápido)
        import secrets
        num_to_get = min(num_words, len(keys))
        selected_keys = secrets.SystemRandom().sample(keys, num_to_get)
        words = [wordlist[k] for k in selected_keys]
        audit = selected_keys
    else:
        # Diceware clássico (5d6) para listas completas (7776 palavras)
        used = set()
        words = []
        audit = []
        while len(words) < num_words:
            code = roll_5d6_code()
            if code in used:
                continue
            used.add(code)
            words.append(wordlist[code])
            audit.append(code)

    return words, audit
