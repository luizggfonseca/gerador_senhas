import math
import secrets
import string
import time
from typing import Dict, Any

from password_generators.base import PasswordGenerator, GeneratedPassword

class AdvancedOptionsGenerator(PasswordGenerator):
    """
    Gerador para opções avançadas: High-Entropy, Consoantes, ProtonPass, PIN, ULID, NanoID.
    """
    id = "advanced_options"

    def __init__(self, app_context):
        super().__init__(app_context)
        self.mode = "high_entropy" # high_entropy, consonants, proton, pin, ulid, nanoid
        self.length = 16
        self.use_upper = True
        self.use_lower = True
        self.alphabet = string.ascii_letters + string.digits # Default for NanoID
        
    def generate(self) -> GeneratedPassword:
        if self.mode == "high_entropy":
            pool = string.ascii_letters + string.digits
            password = "".join(secrets.choice(pool) for _ in range(self.length))
            entropy = self.length * math.log2(len(pool))
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "consonants":
            vowels = "aeiouAEIOU"
            pool = ""
            if self.use_lower:
                pool += "".join(c for c in string.ascii_lowercase if c not in vowels)
            if self.use_upper:
                pool += "".join(c for c in string.ascii_uppercase if c not in vowels)
            
            if not pool:
                return GeneratedPassword("", 0)
                
            password = "".join(secrets.choice(pool) for _ in range(self.length))
            entropy = self.length * math.log2(len(pool))
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "proton":
            # intercalam blocos de letras e números (ex: abcd-1234-efgh)
            # Vamos gerar 3 blocos: letras-números-letras
            # Usamos ascii_letters (52 chars) para aumentar a entropia
            letters_pool = string.ascii_letters
            numbers_pool = string.digits
            
            # Divide o comprimento em 3 partes, dando prioridade para as letras
            base_size = self.length // 3
            extra = self.length % 3
            
            s1 = base_size + (1 if extra > 0 else 0)
            s2 = base_size
            s3 = base_size + (1 if extra > 1 else 0)
            
            b1 = "".join(secrets.choice(letters_pool) for _ in range(s1))
            b2 = "".join(secrets.choice(numbers_pool) for _ in range(s2))
            b3 = "".join(secrets.choice(letters_pool) for _ in range(s3))
            
            password = f"{b1}-{b2}-{b3}"
            # Entropia: (s1+s3)*log2(52) + s2*log2(10)
            # log2(52) ≈ 5.7, log2(10) ≈ 3.32
            entropy = ((s1 + s3) * math.log2(52)) + (s2 * math.log2(10))
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "pin":
            pool = string.digits
            password = "".join(secrets.choice(pool) for _ in range(self.length))
            entropy = self.length * math.log2(10)
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "ulid":
            value = self._generate_ulid()
            # ULID tem 128 bits de informação total.
            return GeneratedPassword(value, 128.0)
            
        elif self.mode == "nanoid":
            # NanoID padrão usa alphabet de 64 chars e length 21
            pool = self.alphabet if self.alphabet else "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_~"
            length = self.length if self.length > 0 else 21
            password = "".join(secrets.choice(pool) for _ in range(length))
            entropy = length * math.log2(len(pool))
            return GeneratedPassword(password, entropy)

        return GeneratedPassword("OPCAO_INVALIDA", 0)

    def _generate_ulid(self):
        alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
        def encode(val, length):
            res = ""
            for _ in range(length):
                res = alphabet[val % 32] + res
                val //= 32
            return res
        
        # 48 bits timestamp
        ts = int(time.time() * 1000) & 0xFFFFFFFFFFFF
        # 80 bits randomness
        rnd = secrets.randbits(80)
        return encode(ts, 10) + encode(rnd, 16)
