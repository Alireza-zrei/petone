from fastapi import APIRouter, Request, status

from app.dependencies import CurrentUser, DbSession
from app.domains.users import service
from app.domains.users.models import User
from app.domains.users.schemas import (
    LoginRequest,
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
    """Authenticate with email and password; returns an access + refresh token pair."""
    return await service.authenticate(db, data.email, data.password)


@router.post("/refresh", response_model=TokenPair)
@limiter.limit("20/minute")
async def refresh(request: Request, data: RefreshRequest, db: DbSession) -> TokenPair:
    """Exchange a valid refresh token for a fresh access + refresh token pair."""
    return await service.refresh_tokens(db, data.refresh_token)


@router.get("/me", response_model=UserRead)
async def read_me(user: CurrentUser) -> User:
    """Return the currently authenticated user."""
    return user
