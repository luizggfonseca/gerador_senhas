from password_generators.base import PasswordGenerator, GeneratedPassword
from diceware.generator import generate_passphrase
from diceware.formatter import format_pure
from core.entropy import diceware_total_entropy


class DicewarePureGenerator(PasswordGenerator):
    id = "diceware_pure"

    def __init__(self, app_context):
        super().__init__(app_context)
        # Default language
        available = sorted(self.app_context["wordlists"].keys())
        self.language = available[0] if available else "portugues"
        self.num_words = 4  # Default sensible value

    def generate(self) -> GeneratedPassword:
        wl = self.app_context["wordlists"].get(self.language)
        if not wl:
             # Fallback if language not found
             wl = next(iter(self.app_context["wordlists"].values()))
        
        # Ensure n is an integer and valid
        try:
            n = int(self.num_words)
            if n < 3:
                n = 3
        except (ValueError, TypeError):
            n = 4

        words, _ = generate_passphrase(wl, n)
        password = format_pure(words, "-")

        entropy = diceware_total_entropy({
            "num_words": len(words),
            "wordlist_size": len(wl),
            "capitalize": False,
            "num_numbers": 0,
            "pool_numbers": 0,
            "num_symbols": 0,
            "pool_symbols": 0,
        })

        return GeneratedPassword(password, float(entropy))
