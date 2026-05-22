import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.users import crud
from app.domains.users.models import User
from app.domains.users.schemas import TokenPair, UserCreate
from app.exceptions import (
    EmailAlreadyRegistered,
    InactiveUser,
    InvalidCredentials,
    InvalidToken,
)
from app.security import (
    REFRESH_TOKEN_TYPE,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)

logger = logging.getLogger(__name__)


def _issue_tokens(user_id: int) -> TokenPair:
    return TokenPair(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


async def register(db: AsyncSession, data: UserCreate) -> User:
    email = data.email.lower()
    if await crud.get_by_email(db, email) is not None:
        raise EmailAlreadyRegistered(email)
    user = await crud.create(
        db,
        email=email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    logger.info("Registered user id=%s", user.id)
    return user


async def authenticate(db: AsyncSession, email: str, password: str) -> TokenPair:
    user = await crud.get_by_email(db, email.lower())
    if user is None or not verify_password(password, user.hashed_password):
        raise InvalidCredentials
    if not user.is_active:
        raise InactiveUser
    return _issue_tokens(user.id)


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenPair:
    user_id = decode_token(refresh_token, REFRESH_TOKEN_TYPE)
    user = await crud.get(db, user_id)
    if user is None or not user.is_active:
        raise InvalidToken("Refresh token subject is no longer valid")
    return _issue_tokens(user.id)


async def get_active_user(db: AsyncSession, user_id: int) -> User:
    user = await crud.get(db, user_id)
    if user is None:
        raise InvalidToken("Token subject does not exist")
    if not user.is_active:
        raise InactiveUser
    return user
