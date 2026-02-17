from password_generators.base import PasswordGenerator, GeneratedPassword
from diceware.generator import generate_passphrase
from diceware.formatter import format_modified
from core.entropy import diceware_total_entropy
from config import MIN_DICEWARE_WORDS


class DicewareModifiedGenerator(PasswordGenerator):
    id = "diceware_modified"

    def __init__(self, app_context):
        super().__init__(app_context)
        available = sorted(self.app_context["wordlists"].keys())
        self.language = available[0] if available else "portugues"
        
        self.num_words = MIN_DICEWARE_WORDS
        self.separator = "-"
        
        # New Configuration Flags
        self.use_uppercase = True  # Controls capitalization (if lower is True)
        self.use_lowercase = True  # If False, force ALL CAPS
        self.use_numbers = True
        self.use_symbols = True
        
        # Counts (can be exposed later, defaulting to 1 for now if enabled)
        self.number_count = 1
        self.symbol_count = 1
        self.capitalize_count = 1  # How many words to capitalize
        
        self.numbers_pool = "0123456789"
        self.symbols_pool = "!@#$%^&*"

    def generate(self) -> GeneratedPassword:
        wl = self.app_context["wordlists"].get(self.language)
        if not wl:
             wl = next(iter(self.app_context["wordlists"].values()))
             
        n = int(self.num_words)

        words, _ = generate_passphrase(wl, n)

        # Logic Mapping
        # If use_lowercase is FALSE -> Force Uppercase (ALL CAPS)
        # If use_lowercase is TRUE and use_uppercase is TRUE -> TitleCase (capitalize_count)
        # If use_lowercase is TRUE and use_uppercase is FALSE -> All lowercase (base)
        
        force_uppercase = not self.use_lowercase
        
        # If force_uppercase is True, capitalize_count is irrelevant (all are uppercased)
        # If force_uppercase is False, use self.capitalize_count IF self.use_uppercase is True
        
        effective_cap_count = int(self.capitalize_count) if self.use_uppercase else 0
        effective_num_count = int(self.number_count) if self.use_numbers else 0
        effective_sym_count = int(self.symbol_count) if self.use_symbols else 0

        options = {
            "separator": self.separator,
            "capitalize_count": min(effective_cap_count, len(words)),
            "force_uppercase": force_uppercase,
            "num_numbers": effective_num_count,
            "num_symbols": effective_sym_count,
            "numbers_pool": self.numbers_pool,
            "symbols_pool": self.symbols_pool,
            "avoid_overlap": True,
        }

        password = format_modified(words, options)

        # Entropy Calculation (approximate adjustment)
        entropy = diceware_total_entropy({
            "num_words": len(words),
            "wordlist_size": len(wl),
            "capitalize": effective_cap_count > 0 or force_uppercase,
            "num_numbers": effective_num_count,
            "pool_numbers": len(set(self.numbers_pool)) if effective_num_count > 0 else 0,
            "num_symbols": effective_sym_count,
            "pool_symbols": len(set(self.symbols_pool)) if effective_sym_count > 0 else 0,
        })

        return GeneratedPassword(password, float(entropy))
