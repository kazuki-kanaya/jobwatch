from datetime import datetime
from pydantic import BaseModel

from app.schemas.workspace import WorkspaceResponse


class UserResponse(BaseModel):
    user_id: str
    name: str
    created_at: datetime
    updated_at: datetime


class UserWorkspacesResponse(BaseModel):
    workspaces: list[WorkspaceResponse]
