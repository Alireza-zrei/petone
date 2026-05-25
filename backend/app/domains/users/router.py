from fastapi import APIRouter, Request, Response, status

from app.dependencies import CurrentUser, DbSession
from app.domains.users import service
from app.domains.users.models import User
from app.domains.users.schemas import (
    LoginRequest,
    OtpLoginVerify,
    OtpRequest,
    PasswordResetVerify,
    PhoneSignupVerify,
    RefreshRequest,
    TokenPair,
    UserCreate,
    UserRead,
)
from app.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, data: UserCreate, db: DbSession) -> User:
    """Register a new user account."""
    return await service.register(db, data)


@router.post("/login", response_model=TokenPair)
@limiter.limit("10/minute")
async def login(request: Request, data: LoginRequest, db: DbSession) -> TokenPair:
    """Authenticate with email-or-phone + password; returns a token pair."""
    return await service.authenticate(db, data.identifier, data.password)


@router.post("/refresh", response_model=TokenPair)
@limiter.limit("20/minute")
async def refresh(request: Request, data: RefreshRequest, db: DbSession) -> TokenPair:
    """Exchange a valid refresh token for a fresh access + refresh token pair."""
    return await service.refresh_tokens(db, data.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(data: RefreshRequest, db: DbSession) -> Response:
    """Revoke a refresh token. Idempotent; succeeds even for unknown tokens."""
    await service.logout(db, data.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserRead)
async def read_me(user: CurrentUser) -> User:
    """Return the currently authenticated user."""
    return user


# --- OTP-based phone login ---


@router.post("/login/otp/request", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("5/minute")
async def request_login_otp(
    request: Request, data: OtpRequest, db: DbSession
) -> Response:
    """Send a one-time login code via SMS. Always 202 to avoid leaking whether
    the mobile is registered. Per-phone resend cooldown can still surface as 409."""
    await service.start_phone_login(db, data.mobile)
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.post("/login/otp/verify", response_model=TokenPair)
@limiter.limit("10/minute")
async def verify_login_otp(
    request: Request, data: OtpLoginVerify, db: DbSession
) -> TokenPair:
    """Consume a login OTP and return a token pair."""
    return await service.complete_phone_login(db, data.mobile, data.code)


# --- OTP-based password reset ---


@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("5/minute")
async def request_password_reset(
    request: Request, data: OtpRequest, db: DbSession
) -> Response:
    """Send a password-reset code via SMS. Always 202."""
    await service.start_password_reset(db, data.mobile)
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.post("/password-reset/verify", response_model=TokenPair)
@limiter.limit("10/minute")
async def verify_password_reset(
    request: Request, data: PasswordResetVerify, db: DbSession
) -> TokenPair:
    """Consume a reset OTP, set the new password, and return a token pair."""
    return await service.complete_password_reset(
        db, data.mobile, data.code, data.new_password
    )


# --- OTP-based phone signup ---


@router.post("/signup/otp/request", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("5/minute")
async def request_signup_otp(
    request: Request, data: OtpRequest, db: DbSession
) -> Response:
    """Send a signup verification code via SMS. Always 202 to avoid leaking
    whether the mobile is already registered. Per-phone resend cooldown can
    still surface as 409."""
    await service.start_phone_signup(db, data.mobile)
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.post("/signup/otp/verify", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def verify_signup_otp(
    request: Request, data: PhoneSignupVerify, db: DbSession
) -> TokenPair:
    """Consume a signup OTP, create the user, and return a token pair."""
    return await service.complete_phone_signup(
        db, data.mobile, data.code, data.email, data.password, data.full_name
    )
