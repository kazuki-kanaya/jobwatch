from fastapi import FastAPI

from app.adapters.middlewares.request_logging import register_request_logging_middleware


def register_middlewares(app: FastAPI) -> None:
    register_request_logging_middleware(app)
