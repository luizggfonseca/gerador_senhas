import json
import os
from datetime import datetime
from typing import List, Dict, Optional
import uuid

class HistoryManager:
    def __init__(self, path: str = "history.json"):
        self.path = path
        self.entries: List[Dict] = []
        self.load()

    def load(self):
        if not os.path.exists(self.path):
            self.entries = []
            return

        try:
            with open(self.path, "r", encoding="utf-8") as f:
                self.entries = json.load(f)
        except Exception as e:
            print(f"Error loading history: {e}")
            self.entries = []

    def save(self):
        try:
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump(self.entries, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving history: {e}")

    def add_entry(self, password: str, mode: str, tag: str = "") -> Dict:
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "mode": mode,
            "password": password,
            "tag": tag
        }
        # Prepend to list (newest first)
        self.entries.insert(0, entry)
        # Keep only last 100 entries to avoid infinite growth? 
        # User said "últimas senhas geradas", implying a limit or just a list. 
        # Let's keep 1000 for now, fairly safe.
        if len(self.entries) > 1000:
            self.entries = self.entries[:1000]
            
        self.save()
        return entry

    def delete_entry(self, entry_id: str):
        self.entries = [e for e in self.entries if e["id"] != entry_id]
        self.save()

    def update_tag(self, entry_id: str, tag: str):
        for entry in self.entries:
            if entry["id"] == entry_id:
                entry["tag"] = tag
                break
        self.save()

    def get_entries(self) -> List[Dict]:
        return self.entries
