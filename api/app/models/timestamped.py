from datetime import datetime

from pydantic import BaseModel, Field

from app.utils.datetime import now


class TimestampedModel(BaseModel):
    created_at: datetime = Field(default_factory=now)
    updated_at: datetime = Field(default_factory=now)

    def touch(self) -> None:
        self.updated_at = now()
