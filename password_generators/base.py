from __future__ import annotations
from dataclasses import dataclass
from abc import ABC, abstractmethod
from typing import Any, Dict


@dataclass(frozen=True)
class GeneratedPassword:
    value: str
    entropy_bits: float


class PasswordGenerator(ABC):
    """
    Interface base para qualquer gerador de senha.
    A UI não deve conhecer detalhes internos do algoritmo.
    """

    id: str

    def __init__(self, app_context):
        self.app_context = app_context

    def configure(self, options: Dict[str, Any]):
        """Atualiza as configurações do gerador com base num dicionário."""
        for key, value in options.items():
            if hasattr(self, key):
                setattr(self, key, value)

    @abstractmethod
    def generate(self) -> GeneratedPassword:
        """Gera a senha com as configurações atuais."""
        raise NotImplementedError
