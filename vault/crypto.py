import os
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


PBKDF2_ITERATIONS = 200_000
KEY_SIZE = 32          # 256 bits
NONCE_SIZE = 12        # recomendado para GCM
SALT_SIZE = 16


def derive_key(password: str, salt: bytes) -> bytes:
    """
    Deriva uma chave criptográfica a partir da senha mestra.
    """
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=KEY_SIZE,
        salt=salt,
        iterations=PBKDF2_ITERATIONS,
    )
    return kdf.derive(password.encode("utf-8"))


def encrypt(data: bytes, key: bytes) -> bytes:
    """
    Criptografa dados usando AES-256-GCM.
    Retorna: nonce + ciphertext
    """
    nonce = os.urandom(NONCE_SIZE)
    aes = AESGCM(key)
    ciphertext = aes.encrypt(nonce, data, None)
    return nonce + ciphertext


def decrypt(data: bytes, key: bytes) -> bytes:
    """
    Descriptografa dados usando AES-256-GCM.
    Espera: nonce + ciphertext
    """
    nonce = data[:NONCE_SIZE]
    ciphertext = data[NONCE_SIZE:]
    aes = AESGCM(key)
    return aes.decrypt(nonce, ciphertext, None)
