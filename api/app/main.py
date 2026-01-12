from fastapi import FastAPI

from app.adapters.api.deps import get_settings
from app.adapters.api.v1.router import v1_router
from app.core.logging import configure_logging
from app.adapters.middlewares.register import register_middlewares

settings = get_settings()
configure_logging(settings.log_level)

app = FastAPI(title="Jobwatch API")
app.include_router(v1_router)
register_middlewares(app)
