import secrets
from typing import List, Sequence, TypeVar

T = TypeVar("T")


def secure_sample(seq: Sequence[T], k: int) -> List[T]:
    """Amostragem sem repetição usando fonte criptográfica."""
    k = max(0, min(int(k), len(seq)))
    if k == 0:
        return []
    return secrets.SystemRandom().sample(list(seq), k)
