from dataclasses import dataclass, field
from datetime import datetime
import uuid


@dataclass
class VaultEntry:
    timestamp: datetime
    mode: str
    password: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    tag: str = ""  # e.g., "in_use"
