import hashlib
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.exceptions import InvalidToken

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return _pwd_context.verify(password, hashed)


def hash_refresh_token(token: str) -> str:
    """Fast deterministic hash for indexed lookup of stored refresh tokens.

    bcrypt is unnecessary: tokens are high-entropy JWTs, not user-chosen secrets,
    and we need an exact-match index lookup on every /auth/refresh call.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _create_token(subject: int, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.now(UTC)
    payload = {
        "sub": str(subject),
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        # jti guarantees every token's payload is unique even when issued in
        # the same second, so the stored refresh-token hash is always unique.
        "jti": uuid4().hex,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(subject: int) -> str:
    delta = timedelta(minutes=settings.access_token_expire_minutes)
    return _create_token(subject, ACCESS_TOKEN_TYPE, delta)


def create_refresh_token(subject: int) -> str:
    delta = timedelta(days=settings.refresh_token_expire_days)
    return _create_token(subject, REFRESH_TOKEN_TYPE, delta)


def decode_token(token: str, expected_type: str) -> int:
    """Decode and verify a JWT, returning the subject (user id)."""
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
    except JWTError as exc:
        raise InvalidToken("Token is invalid or expired") from exc
    if payload.get("type") != expected_type:
        raise InvalidToken(f"Expected a {expected_type} token")
    subject = payload.get("sub")
    if subject is None:
        raise InvalidToken("Token is missing a subject")
    return int(subject)
