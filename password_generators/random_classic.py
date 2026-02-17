import math
import secrets
import string
import uuid

from password_generators.base import PasswordGenerator, GeneratedPassword


class RandomClassicGenerator(PasswordGenerator):
    id = "random_classic"

    MIN_LENGTH = 10
    UUID_ENTROPY_BITS = 122.0  # UUID v4 efetivo

    def __init__(self, app_context):
        super().__init__(app_context)
        # Defaults
        self.mode = "classic"  # classic, token
        self.token_type = "hex"  # hex, urlsafe, uuid
        self.token_length = 32
        self.length = 16
        
        self.use_upper = True
        self.use_lower = True
        self.use_numbers = True
        self.symbols = "!@#$%^&*()-_=+[]{};:,.<>?/"
        
        self.exclude_ambiguous = False

    def generate(self) -> GeneratedPassword:
        # ==================== TOKEN ====================
        if self.mode == "token":
            if self.token_type == "uuid":
                value = str(uuid.uuid4())
                return GeneratedPassword(value, self.UUID_ENTROPY_BITS)

            token_length = int(self.token_length)

            if self.token_type == "hex":
                # Cada byte hex = 2 caracteres; gerar bytes suficientes e truncar
                nbytes = math.ceil(token_length / 2)
                value = secrets.token_hex(nbytes)[:token_length]
                # Entropia: cada char hex = log2(16) = 4 bits
                entropy = token_length * 4.0
            else:
                # urlsafe base64: ~4/3 chars por byte; gerar extra e truncar
                nbytes = math.ceil(token_length * 3 / 4) + 1
                value = secrets.token_urlsafe(nbytes)[:token_length]
                # Entropia: cada char base64url = log2(64) = 6 bits
                entropy = token_length * 6.0

            return GeneratedPassword(value, entropy)

        # ==================== SENHA CLÁSSICA ====================
        length = int(self.length)
        if length < self.MIN_LENGTH:
            raise RuntimeError(
                f"Senha aleatória deve ter no mínimo {self.MIN_LENGTH} caracteres."
            )

        # Ambiguous characters definition
        AMBIGUOUS = "1lI0O"

        pool = ""
        pools = []
        
        # Helper to filter if needed
        def filter_pool(chars):
            if self.exclude_ambiguous:
                return "".join(c for c in chars if c not in AMBIGUOUS)
            return chars

        if self.use_upper:
            p = filter_pool(string.ascii_uppercase)
            if p: 
                pools.append(p)
                pool += p

        if self.use_lower:
            p = filter_pool(string.ascii_lowercase)
            if p:
                pools.append(p)
                pool += p

        if self.use_numbers:
            p = filter_pool(string.digits)
            if p: 
                pools.append(p)
                pool += p

        if self.symbols:
            # Depending on definition, symbol strings might manually exclude ambiguous looking ones
            # But standard ambiguity usually refers to alphanumerics.
            # We filter just in case the user considers '|' or similar ambiguous, but strict set is 1lI0O.
            p = filter_pool(self.symbols)
            if p:
                pools.append(p)
                pool += p

        # Remove duplicates from pool string and ensure unique characters
        pool = "".join(sorted(set(pool)))

        if not pool:
            raise RuntimeError("Selecione conjuntos que resultem em caracteres válidos.")

        # Ensure at least one character from each selected pool is included
        chars = [secrets.choice(p) for p in pools]

        while len(chars) < length:
            chars.append(secrets.choice(pool))

        secrets.SystemRandom().shuffle(chars)

        password = "".join(chars)
        
        # Entropy Calculation
        entropy = length * math.log2(len(pool)) if pool else 0

        return GeneratedPassword(password, float(entropy))
