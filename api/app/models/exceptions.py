class ObsernException(Exception):
    """Base exception for Obsern domain."""

    pass


class NotFoundException(ObsernException):
    """Raised when a resource is not found."""

    pass


class RepositoryException(ObsernException):
    """Raised when a repository operation fails."""

    pass


class AuthenticationError(ObsernException):
    """Raised when authentication fails."""

    pass


class PermissionDeniedError(ObsernException):
    """Raised when access is denied."""

    pass


class ConditionalCheckFailedError(ObsernException):
    """Raised when a conditional write check fails."""

    pass
