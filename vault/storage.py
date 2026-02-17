import json
import os
from datetime import datetime
from typing import List

from vault.crypto import (
    derive_key,
    encrypt,
    decrypt,
    SALT_SIZE,
)
from vault.model import VaultEntry


class Vault:
    def __init__(self, path: str):
        self.path = path
        self.salt_path = path + ".salt"
        self.entries: List[VaultEntry] = []
        self._key: bytes | None = None

    # --------------------------------------------------

    def exists(self) -> bool:
        return os.path.exists(self.path) and os.path.exists(self.salt_path)

    # --------------------------------------------------

    def initialize(self, master_password: str):
        """
        Cria um novo vault com uma senha mestra.
        """
        if self.exists():
            raise RuntimeError("Vault já existe.")

        salt = os.urandom(SALT_SIZE)
        with open(self.salt_path, "wb") as f:
            f.write(salt)

        self._key = derive_key(master_password, salt)
        self.entries = []
        self._save()

    # --------------------------------------------------

    def unlock(self, master_password: str):
        """
        Abre um vault existente usando a senha mestra.
        """
        if not self.exists():
            raise RuntimeError("Vault não existe.")

        with open(self.salt_path, "rb") as f:
            salt = f.read()

        key = derive_key(master_password, salt)

        with open(self.path, "rb") as f:
            encrypted = f.read()

        try:
            raw = decrypt(encrypted, key)
        except Exception:
            raise RuntimeError("Senha mestra incorreta.")

        data = json.loads(raw.decode("utf-8"))

        self.entries = [
            VaultEntry(
                timestamp=datetime.fromisoformat(e["timestamp"]),
                mode=e["mode"],
                password=e["password"],
                id=e.get("id"),  # Will use default factory if None
                tag=e.get("tag", ""),
            )
            for e in data.get("entries", [])
        ]
        
        # Ensure all entries have IDs (migration for legacy data)
        # Note: dataclass default_factory only works on __init__ if missing argument.
        # If e.get("id") returns None, we might pass None to __init__ which might be issue if type is strict str.
        # Let's fix explicitly.
        
        import uuid
        for i, entry in enumerate(self.entries):
            if not entry.id:
                 # Modify directly or replace
                 # simpler to rebuild list if needed, but here we can set attribute
                 # confusing since dataclass is mutable by default
                 entry.id = str(uuid.uuid4())


        self._key = key

    # --------------------------------------------------

    def _save(self):
        if self._key is None:
            raise RuntimeError("Vault não desbloqueado.")

        data = {
            "version": 1,
            "entries": [
                {
                    "id": e.id,
                    "timestamp": e.timestamp.isoformat(),
                    "mode": e.mode,
                    "password": e.password,
                    "tag": e.tag,
                }
                for e in self.entries
            ],
        }

        raw = json.dumps(data, ensure_ascii=False).encode("utf-8")
        encrypted = encrypt(raw, self._key)

        with open(self.path, "wb") as f:
            f.write(encrypted)

    # --------------------------------------------------

    def add_entry(self, password: str, mode: str):
        if self._key is None:
            raise RuntimeError("Vault não desbloqueado.")

        self.entries.append(
            VaultEntry(
                timestamp=datetime.now(),
                mode=mode,
                password=password,
            )
        )
        self._save()

    def delete_entry(self, entry_id: str):
        if self._key is None:
            raise RuntimeError("Vault não desbloqueado.")
        
        self.entries = [e for e in self.entries if e.id != entry_id]
        self._save()

    def update_tag(self, entry_id: str, tag: str):
        if self._key is None:
            raise RuntimeError("Vault não desbloqueado.")
            
        for e in self.entries:
            if e.id == entry_id:
                e.tag = tag
                break
        self._save()

    # --------------------------------------------------

    def list_entries(self):
        """
        Retorna metadados das entradas (sem expor senha).
        """
        return [
            {
                "timestamp": e.timestamp,
                "mode": e.mode,
            }
            for e in self.entries
        ]

    # --------------------------------------------------

    def get_entry(self, index: int) -> VaultEntry:
        return self.entries[index]
