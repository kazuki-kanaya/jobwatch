from datetime import datetime
from functools import lru_cache
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.dependencies.settings import get_settings


@lru_cache
def get_app_timezone() -> ZoneInfo:
    timezone_name = get_settings().app_timezone
    try:
        return ZoneInfo(timezone_name)
    except ZoneInfoNotFoundError:
        return ZoneInfo("UTC")


def now() -> datetime:
    return datetime.now(get_app_timezone())
