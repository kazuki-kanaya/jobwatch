from datetime import datetime
from pydantic import BaseModel


class Host(BaseModel):
    id: str
    workspace_id: str
    name: str
    token_hash: str

    created_at: datetime
    updated_at: datetime
