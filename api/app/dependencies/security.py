import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import Settings
from app.database.host_repository import HostRepository
from app.database.user_repository import UserRepository
from app.database.workspace_membership_repository import WorkspaceMembershipRepository
from app.dependencies.repositories import (
    get_host_repository,
    get_user_repository,
    get_workspace_membership_repository,
)
from app.dependencies.settings import get_jwks_client
from app.dependencies.settings import get_settings
from app.models.exceptions import AuthenticationError, PermissionDeniedError
from app.models.host import Host
from app.models.user import User
from app.models.workspace_membership import MembershipRole, WorkspaceMembership

security = HTTPBearer(auto_error=False)


def _validate_client_claim(payload: dict, expected_client_id: str) -> None:
    aud = payload.get("aud")
    client_id = payload.get("client_id")  # for cognito
    if aud == expected_client_id or client_id == expected_client_id:
        return
    raise AuthenticationError(
        'Invalid OIDC token: expected "aud" or "client_id" to match configured client id'
    )


def get_current_host(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    host_repository: HostRepository = Depends(get_host_repository),
) -> Host:
    """Verify host token and return authenticated host."""
    if not credentials:
        raise AuthenticationError("Missing host authentication token")
    token = credentials.credentials
    token_hash = Host.hash_token(token)
    host = host_repository.find_by_token_hash(token_hash)
    if host is None:
        raise AuthenticationError("Invalid host authentication token")
    return host


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    settings: Settings = Depends(get_settings),
    jwks_client: jwt.PyJWKClient = Depends(get_jwks_client),
    user_repository: UserRepository = Depends(get_user_repository),
) -> User:
    """Verify OIDC JWT token and return user sub claim."""
    if not credentials:
        raise AuthenticationError("Missing user authentication token")
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token).key
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=settings.oidc_issuer,
            options={"verify_aud": False},
        )
        _validate_client_claim(payload, settings.oidc_audience)
        user_id = payload["sub"]
        token_name = payload.get("name")
        current_user = user_repository.get(user_id)
        if not current_user:
            user = User(
                user_id=user_id,
                name=token_name or "no name",
            )
            current_user = user_repository.create(user)
        elif token_name and current_user.name != token_name:
            current_user.name = token_name
            current_user.touch()
            current_user = user_repository.update(current_user)
        return current_user
    except jwt.PyJWTError as e:
        raise AuthenticationError(f"Invalid OIDC token: {e}") from e
    except Exception as e:
        raise AuthenticationError(f"Failed to authenticate user: {e}") from e


def require_workspace_role(min_role: MembershipRole):
    def dependency(
        workspace_id: str,
        current_user: User = Depends(get_current_user),
        workspace_membership_repository: WorkspaceMembershipRepository = Depends(
            get_workspace_membership_repository
        ),
    ) -> WorkspaceMembership:
        membership = workspace_membership_repository.get(
            workspace_id, current_user.user_id
        )
        if membership is None:
            raise PermissionDeniedError("You are not a member of this workspace")
        if not membership.role.allows(min_role):
            raise PermissionDeniedError(
                f"This action requires {min_role.value} role or higher"
            )
        return membership

    return dependency
