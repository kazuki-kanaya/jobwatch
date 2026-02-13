from fastapi import FastAPI

from app.dependencies.settings import get_settings
from app.config import configure_logging
from app.exception_handlers import register_exception_handlers
from app.middlewares import register_middlewares
from app.routers.register import register_routers


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(title="Jobwatch API")
    register_routers(app)
    register_middlewares(app, settings)
    register_exception_handlers(app)
    return app


app = create_app()
