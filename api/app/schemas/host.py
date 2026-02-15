from datetime import datetime

from pydantic import BaseModel


class HostCreateRequest(BaseModel):
    name: str


class HostUpdateRequest(BaseModel):
    name: str


class HostCreateResponse(BaseModel):
    host_id: str
    workspace_id: str
    name: str
    token: str
    created_at: datetime
    updated_at: datetime
    message: str


class HostResponse(BaseModel):
    host_id: str
    workspace_id: str
    name: str
    created_at: datetime
    updated_at: datetime
