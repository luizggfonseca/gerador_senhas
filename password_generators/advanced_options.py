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
        self.mode = "high_entropy" # high_entropy, consonants, proton, pin, ulid, nanoid, fips181, bubble_babble
        self.length = 16
        self.alphabet = string.ascii_letters + string.digits # Default for NanoID
        
    def generate(self) -> GeneratedPassword:
        if self.mode == "high_entropy":
            pool = string.ascii_letters + string.digits
            password = "".join(secrets.choice(pool) for _ in range(self.length))
            entropy = self.length * math.log2(len(pool))
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "consonants":
            vowels = "aeiouAEIOU"
            pool = "".join(c for c in string.ascii_letters if c not in vowels)
            password = "".join(secrets.choice(pool) for _ in range(self.length))
            entropy = self.length * math.log2(len(pool))
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "proton":
            # intercalam blocos de letras e números (ex: abcd-1234-efgh)
            # Vamos gerar 3 blocos: letras-números-letras
            letters_pool = string.ascii_lowercase
            numbers_pool = string.digits
            
            block_size = max(4, self.length // 3)
            b1 = "".join(secrets.choice(letters_pool) for _ in range(block_size))
            b2 = "".join(secrets.choice(numbers_pool) for _ in range(block_size))
            b3 = "".join(secrets.choice(letters_pool) for _ in range(block_size))
            
            password = f"{b1}-{b2}-{b3}"
            # Entropia real dos caracteres gerados
            entropy = (block_size * 2 * math.log2(26)) + (block_size * math.log2(10))
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "pin":
            pool = string.digits
            password = "".join(secrets.choice(pool) for _ in range(self.length))
            entropy = self.length * math.log2(10)
            return GeneratedPassword(password, entropy)
            
        elif self.mode == "ulid":
            value = self._generate_ulid()
            # ULID tem 128 bits de informação total, mas 48 são timestamp (previsível)
            # A entropia de segurança real é 80 bits.
            return GeneratedPassword(value, 80.0)
            
        elif self.mode == "nanoid":
            # NanoID padrão usa alphabet de 64 chars e length 21
            pool = self.alphabet if self.alphabet else "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_~"
            length = self.length if self.length > 0 else 21
            password = "".join(secrets.choice(pool) for _ in range(length))
            entropy = length * math.log2(len(pool))
            return GeneratedPassword(password, entropy)

        elif self.mode == "fips181":
            password = self._generate_fips181(self.length)
            # Entropia aproximada (fonemas são limitados)
            # Syllables are roughly ~12 bits each.
            entropy = (self.length / 3) * 12.0 
            return GeneratedPassword(password, entropy)

        elif self.mode == "bubble_babble":
            # Gera 8 bytes aleatórios e codifica
            raw = secrets.token_bytes(6)
            password = self._bubble_babble(raw)
            entropy = 6 * 8.0 # 48 bits de aleatoriedade na base
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

    def _generate_fips181(self, length):
        vowels = "aeiou"
        consonants = "bcdfghjklmnpqrstvwxyz"
        res = ""
        while len(res) < length:
            # syllable: CVC or CV
            s = secrets.choice(consonants) + secrets.choice(vowels)
            if secrets.randbelow(2) == 0:
                s += secrets.choice(consonants)
            res += s
        return res[:length]

    def _bubble_babble(self, data: bytes) -> str:
        vowels = "aeiouy"
        consonants = "bcdfghklmnprstvzx"
        
        # Simplified BubbleBabble logic
        # Spec is x + v + c + v + c ... + x
        # With checksum bits.
        # Here we implement the essence: alternating sounds.
        res = ["x"]
        seed = 1
        for i in range(0, len(data), 2):
            if i + 1 < len(data):
                b1, b2 = data[i], data[i+1]
                v1 = (((b1 >> 6) & 3) + seed) % 6
                c1 = (b1 >> 2) & 15
                v2 = (b1 & 3) % 6
                # simplified
                res.append(vowels[v1])
                res.append(consonants[c1])
                res.append(vowels[v2])
                
                v3 = (((b2 >> 6) & 3) + seed) % 6
                c2 = (b2 >> 2) & 15
                v4 = (b2 & 3) % 6
                res.append("-")
                res.append(vowels[v3])
                res.append(consonants[c2])
                res.append(vowels[v4])
            else:
                b1 = data[i]
                v1 = (((b1 >> 6) & 3) + seed) % 6
                c1 = (b1 >> 2) & 15
                v2 = (b1 & 3) % 6
                res.append(vowels[v1])
                res.append(consonants[c1])
                res.append(vowels[v2])
        res.append("x")
        return "".join(res)
