import hashlib
import secrets

from app.models.timestamped import TimestampedModel


class Host(TimestampedModel):
    host_id: str
    workspace_id: str
    name: str
    token_hash: str

    @staticmethod
    def generate_token() -> str:
        """Generate a secure random token (32 bytes = 64 hex characters)."""
        return secrets.token_hex(32)

    @staticmethod
    def hash_token(token: str) -> str:
        """Hash a token using SHA-256 (deterministic for GSI lookup)."""
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    @staticmethod
    def verify_token(token: str, token_hash: str) -> bool:
        """Verify a token against its hash."""
        return Host.hash_token(token) == token_hash
