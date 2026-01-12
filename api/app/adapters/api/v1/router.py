from fastapi import APIRouter

from app.adapters.api.v1.health import health_router
from app.adapters.api.v1.jobs import jobs_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(health_router)
v1_router.include_router(jobs_router)
