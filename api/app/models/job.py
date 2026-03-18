from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    RUNNING = "running"
    FINISHED = "finished"
    FAILED = "failed"
    CANCELED = "canceled"


class Job(BaseModel):
    job_id: str
    workspace_id: str
    host_id: str
    status: JobStatus
    command: str
    tags: list[str] = Field(default_factory=list)
    tail_lines: list[str] = Field(default_factory=list)
    created_at: datetime
    started_at: datetime
    finished_at: datetime | None = None
