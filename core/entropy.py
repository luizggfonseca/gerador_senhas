import math
from typing import Dict


def entropy_from_wordlist(num_words: int, wordlist_size: int) -> float:
    if num_words <= 0 or wordlist_size <= 1:
        return 0.0
    return float(num_words) * math.log2(float(wordlist_size))


def entropy_from_charset(length: int, charset_size: int) -> float:
    if length <= 0 or charset_size <= 1:
        return 0.0
    return float(length) * math.log2(float(charset_size))


def entropy_capitalization(num_words: int, enabled: bool) -> float:
    # 2 possibilidades por palavra (capitalizada ou não)
    if not enabled or num_words <= 0:
        return 0.0
    return float(num_words) * math.log2(2.0)


def entropy_insertions(count: int, pool_size: int) -> float:
    if count <= 0 or pool_size <= 1:
        return 0.0
    return float(count) * math.log2(float(pool_size))


def diceware_total_entropy(cfg: Dict) -> float:
    """
    cfg esperado:
      num_words: int
      wordlist_size: int
      capitalize: bool
      num_numbers: int
      pool_numbers: int (ex: 10)
      num_symbols: int
      pool_symbols: int (len do pool de símbolos)
    """
    n = int(cfg.get("num_words", 0))
    d = int(cfg.get("wordlist_size", 0))

    total = entropy_from_wordlist(n, d)
    total += entropy_capitalization(n, bool(cfg.get("capitalize", False)))
    total += entropy_insertions(int(cfg.get("num_numbers", 0)), int(cfg.get("pool_numbers", 0)))
    total += entropy_insertions(int(cfg.get("num_symbols", 0)), int(cfg.get("pool_symbols", 0)))
    return total


def crack_time_bucket(bits: float, guesses_per_second: float = 1e11) -> str:
    """
    Retorna apenas: dias | meses | anos | impenetrável (bilhões de anos)
    """
    if bits <= 0:
        return "---"

    seconds = (2 ** bits) / float(guesses_per_second)
    days = seconds / 86400.0

    # tudo abaixo de 1 dia a gente reporta como "dias"
    if days < 30:
        return "dias"
    if days < 365:
        return "meses"

    years = days / 365.0
    if years >= 1e9:
        return "impenetrável"
    return "anos"
