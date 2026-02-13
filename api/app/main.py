from fastapi import FastAPI

from app.dependencies.settings import get_settings
from app.config import configure_logging
from app.exception_handlers import register_exception_handlers
from app.middlewares import register_middlewares
from app.routers import health, hosts, jobs, user, workspaces


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(title="Jobwatch API")

    app.include_router(health.router)
    app.include_router(workspaces.router)
    app.include_router(hosts.router)
    app.include_router(jobs.router)
    app.include_router(user.router)

    register_middlewares(app)
    register_exception_handlers(app)
    return app


app = create_app()
