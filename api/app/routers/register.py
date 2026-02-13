from fastapi import FastAPI

from app.routers.health import router as health_router
from app.routers.hosts import router as hosts_router
from app.routers.invitations import router as invitations_router
from app.routers.jobs import router as jobs_router
from app.routers.user import router as user_router
from app.routers.workspaces import router as workspaces_router


def register_routers(app: FastAPI) -> None:
    app.include_router(health_router)
    app.include_router(workspaces_router)
    app.include_router(hosts_router)
    app.include_router(jobs_router)
    app.include_router(user_router)
    app.include_router(invitations_router)
