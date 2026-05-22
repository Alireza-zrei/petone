from fastapi import APIRouter, status

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

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: DbSession) -> User:
    return await service.register(db, data)


@router.post("/login", response_model=TokenPair)
async def login(data: LoginRequest, db: DbSession) -> TokenPair:
    return await service.authenticate(db, data.email, data.password)


@router.post("/refresh", response_model=TokenPair)
async def refresh(data: RefreshRequest, db: DbSession) -> TokenPair:
    return await service.refresh_tokens(db, data.refresh_token)


@router.get("/me", response_model=UserRead)
async def read_me(user: CurrentUser) -> User:
    return user
