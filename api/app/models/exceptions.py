class JobwatchException(Exception):
    """Base exception for Jobwatch domain."""

    pass


class NotFoundException(JobwatchException):
    """Raised when a resource is not found."""

    pass


class RepositoryException(JobwatchException):
    """Raised when a repository operation fails."""

    pass


class AuthenticationError(JobwatchException):
    """Raised when authentication fails."""

    pass


class PermissionDeniedError(JobwatchException):
    """Raised when access is denied."""

    pass


class ConditionalCheckFailedError(JobwatchException):
    """Raised when a conditional write check fails."""

    pass
