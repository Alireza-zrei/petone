import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.domains.users import crud, otp
from app.domains.users.models import OtpPurpose, User
from app.domains.users.phone import normalize_iranian_mobile
from app.domains.users.schemas import TokenPair, UserCreate
from app.exceptions import (
    EmailAlreadyRegistered,
    InactiveUser,
    InvalidCredentials,
    InvalidToken,
    OtpInvalid,
    PhoneAlreadyRegistered,
    TokenExpired,
    TokenRevoked,
)
from app.security import (
    REFRESH_TOKEN_TYPE,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)

logger = logging.getLogger(__name__)


async def _issue_tokens(db: AsyncSession, user_id: int) -> TokenPair:
    """Mint a fresh access + refresh pair and persist the refresh token's hash."""
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)
    expires_at = datetime.now(UTC) + timedelta(
        days=settings.refresh_token_expire_days
    )
    await crud.create_refresh_token(
        db,
        user_id=user_id,
        token_hash=hash_refresh_token(refresh),
        expires_at=expires_at,
    )
    return TokenPair(access_token=access, refresh_token=refresh)


async def register(db: AsyncSession, data: UserCreate) -> User:
    email = data.email.lower()
    phone = normalize_iranian_mobile(data.phone)  # may raise InvalidPhoneNumber
    if await crud.get_by_email(db, email) is not None:
        raise EmailAlreadyRegistered(email)
    if await crud.get_by_phone(db, phone) is not None:
        raise PhoneAlreadyRegistered(phone)
    user = await crud.create(
        db,
        email=email,
        phone=phone,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    logger.info("Registered user id=%s", user.id)
    return user


async def authenticate(
    db: AsyncSession, identifier: str, password: str
) -> TokenPair:
    """Look up a user by email-or-phone, verify password, mint tokens.

    Email is detected by the presence of '@'; anything else is normalized as
    an Iranian mobile number. A bad phone format is treated as wrong
    credentials so we don't leak whether a given input shape exists.
    """
    identifier = identifier.strip()
    if "@" in identifier:
        user = await crud.get_by_email(db, identifier.lower())
    else:
        try:
            phone = normalize_iranian_mobile(identifier)
        except Exception:
            raise InvalidCredentials from None
        user = await crud.get_by_phone(db, phone)
    if user is None or not verify_password(password, user.hashed_password):
        raise InvalidCredentials
    if not user.is_active:
        raise InactiveUser
    return await _issue_tokens(db, user.id)


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenPair:
    # 1. Verify signature + type (catches forgery and access-token misuse).
    user_id = decode_token(refresh_token, REFRESH_TOKEN_TYPE)
    # 2. Verify the token row exists, isn't revoked, and isn't expired.
    stored = await crud.get_refresh_token(db, hash_refresh_token(refresh_token))
    if stored is None:
        raise InvalidToken("Refresh token is not recognized")
    now = datetime.now(UTC)
    expires_at = stored.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if stored.revoked_at is not None:
        raise TokenRevoked
    if expires_at <= now:
        raise TokenExpired("refresh")
    user = await crud.get(db, user_id)
    if user is None or not user.is_active:
        raise InvalidToken("Refresh token subject is no longer valid")
    # 3. Rotate: revoke the presented token, issue a fresh pair.
    await crud.revoke_refresh_token(db, stored, now=now)
    return await _issue_tokens(db, user.id)


async def logout(db: AsyncSession, refresh_token: str) -> None:
    """Revoke a refresh token. No-op if the token is unknown or already revoked,
    so that a client can call /auth/logout safely even with a stale token."""
    try:
        decode_token(refresh_token, REFRESH_TOKEN_TYPE)
    except InvalidToken:
        return
    stored = await crud.get_refresh_token(db, hash_refresh_token(refresh_token))
    if stored is None or stored.revoked_at is not None:
        return
    await crud.revoke_refresh_token(db, stored, now=datetime.now(UTC))


async def get_active_user(db: AsyncSession, user_id: int) -> User:
    user = await crud.get(db, user_id)
    if user is None:
        raise InvalidToken("Token subject does not exist")
    if not user.is_active:
        raise InactiveUser
    return user


# --- OTP flows ---


async def start_phone_login(db: AsyncSession, mobile: str) -> None:
    """Send an OTP for phone-based login if the mobile maps to an active user.

    Returns silently in all cases so the caller (router) can answer 202 without
    leaking whether a phone is registered. Per-phone resend throttling still
    surfaces as OtpResendTooSoon so legitimate users aren't confused by silent
    rate-limiting.
    """
    phone = normalize_iranian_mobile(mobile)
    user = await crud.get_by_phone(db, phone)
    if user is None or not user.is_active:
        logger.info("OTP login requested for unknown/inactive mobile=%s", phone)
        return
    await otp.issue(db, phone, OtpPurpose.LOGIN)


async def complete_phone_login(
    db: AsyncSession, mobile: str, code: str
) -> TokenPair:
    phone = normalize_iranian_mobile(mobile)
    await otp.verify(db, phone, OtpPurpose.LOGIN, code)
    user = await crud.get_by_phone(db, phone)
    if user is None or not user.is_active:
        # Race: account deactivated between request and verify.
        raise OtpInvalid()
    return await _issue_tokens(db, user.id)


async def start_password_reset(db: AsyncSession, mobile: str) -> None:
    phone = normalize_iranian_mobile(mobile)
    user = await crud.get_by_phone(db, phone)
    if user is None or not user.is_active:
        logger.info("Password reset for unknown/inactive mobile=%s", phone)
        return
    await otp.issue(db, phone, OtpPurpose.PASSWORD_RESET)


async def complete_password_reset(
    db: AsyncSession, mobile: str, code: str, new_password: str
) -> TokenPair:
    phone = normalize_iranian_mobile(mobile)
    await otp.verify(db, phone, OtpPurpose.PASSWORD_RESET, code)
    user = await crud.get_by_phone(db, phone)
    if user is None or not user.is_active:
        raise OtpInvalid()
    await crud.update_password(db, user, hash_password(new_password))
    # Defence-in-depth: revoke every outstanding refresh token so a stolen
    # session can't survive a password reset.
    await crud.revoke_all_user_tokens(db, user.id, now=datetime.now(UTC))
    logger.info("Password reset completed for user id=%s", user.id)
    return await _issue_tokens(db, user.id)


async def start_phone_signup(db: AsyncSession, mobile: str) -> None:
    """Send a SIGNUP OTP if the mobile is not already registered.

    Mirror of start_phone_login: silent-202 when the phone is taken so the
    caller can't enumerate registered numbers via this endpoint.
    """
    phone = normalize_iranian_mobile(mobile)
    if await crud.get_by_phone(db, phone) is not None:
        logger.info("Signup OTP requested for already-registered mobile=%s", phone)
        return
    await otp.issue(db, phone, OtpPurpose.SIGNUP)


async def complete_phone_signup(
    db: AsyncSession,
    mobile: str,
    code: str,
    email: str,
    password: str,
    full_name: str,
) -> TokenPair:
    phone = normalize_iranian_mobile(mobile)
    await otp.verify(db, phone, OtpPurpose.SIGNUP, code)
    normalized_email = email.lower()
    if await crud.get_by_email(db, normalized_email) is not None:
        raise EmailAlreadyRegistered(normalized_email)
    if await crud.get_by_phone(db, phone) is not None:
        # Race: a concurrent signup with the same phone slipped in between
        # OTP request and verify. Don't leak that fact.
        raise OtpInvalid()
    user = await crud.create(
        db,
        email=normalized_email,
        phone=phone,
        hashed_password=hash_password(password),
        full_name=full_name,
    )
    logger.info("Registered user via phone signup id=%s", user.id)
    return await _issue_tokens(db, user.id)
