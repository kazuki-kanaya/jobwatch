import logging
import time

from fastapi import FastAPI, Request

logger = logging.getLogger(__name__)


def register_request_logging_middleware(app: FastAPI) -> None:
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            logger.exception("Unhandled error %s %s", request.method, request.url.path)
            raise
        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "%s %s -> %s %.2fms",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        return response
