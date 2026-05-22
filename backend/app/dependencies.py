from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.domains.users import service as users_service
from app.domains.users.models import User
from app.exceptions import AdminRequired, InvalidToken
from app.security import ACCESS_TOKEN_TYPE, decode_token

DbSession = Annotated[AsyncSession, Depends(get_db)]

_bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer_scheme)],
) -> User:
    if credentials is None:
        raise InvalidToken("Missing or malformed Authorization header")
    user_id = decode_token(credentials.credentials, ACCESS_TOKEN_TYPE)
    return await users_service.get_active_user(db, user_id)


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_admin(user: CurrentUser) -> User:
    if not user.is_admin:
        raise AdminRequired
    return user
