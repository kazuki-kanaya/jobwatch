import hashlib
import secrets

from datetime import datetime

from app.models.timestamped import TimestampedModel
from app.models.workspace_membership import MembershipRole


class WorkspaceInvitation(TimestampedModel):
    invitation_id: str
    workspace_id: str
    role: MembershipRole
    token_hash: str
    created_by_user_id: str
    expires_at: datetime
    used_at: datetime | None = None

    @staticmethod
    def generate_token() -> str:
        return secrets.token_urlsafe(32)

    @staticmethod
    def hash_token(token: str) -> str:
        return f"INVITE#{hashlib.sha256(token.encode('utf-8')).hexdigest()}"
