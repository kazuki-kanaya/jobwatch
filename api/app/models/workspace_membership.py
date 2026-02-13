from enum import Enum

from app.models.timestamped import TimestampedModel


class MembershipRole(str, Enum):
    OWNER = "owner"
    EDITOR = "editor"
    VIEWER = "viewer"

    @property
    def level(self) -> int:
        levels = {
            MembershipRole.VIEWER: 1,
            MembershipRole.EDITOR: 2,
            MembershipRole.OWNER: 3,
        }
        return levels[self]

    def allows(self, required: "MembershipRole") -> bool:
        return self.level >= required.level


class WorkspaceMembership(TimestampedModel):
    workspace_id: str
    user_id: str
    role: MembershipRole
