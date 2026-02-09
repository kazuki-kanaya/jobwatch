from datetime import datetime

from pydantic import BaseModel


class Workspace(BaseModel):
    workspace_id: str
    name: str
    created_at: datetime
    updated_at: datetime
