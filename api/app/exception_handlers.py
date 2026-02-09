import http
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.models.exceptions import (
    AuthenticationError,
    NotFoundException,
    RepositoryException,
)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AuthenticationError)
    async def handle_authentication_error(
        request: Request, exception: AuthenticationError
    ) -> JSONResponse:
        """Handle authentication errors with 401 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.UNAUTHORIZED,
            content={"detail": str(exception)},
            headers={"WWW-Authenticate": "Bearer"},
        )

    @app.exception_handler(NotFoundException)
    async def handle_not_found_error(
        request: Request, exception: NotFoundException
    ) -> JSONResponse:
        """Handle not found errors with 404 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.NOT_FOUND,
            content={"detail": str(exception)},
        )

    @app.exception_handler(RepositoryException)
    async def handle_repository_error(
        request: Request, exception: RepositoryException
    ) -> JSONResponse:
        """Handle repository errors with 500 status."""
        return JSONResponse(
            status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR,
            content={"detail": str(exception)},
        )
