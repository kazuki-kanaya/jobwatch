from app.models.timestamped import TimestampedModel


class User(TimestampedModel):
    user_id: str
    name: str
