from collections.abc import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.domains.users import crud as users_crud
from app.main import app
from app.security import create_access_token, hash_password


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session

    await engine.dispose()


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def admin_headers(db_session: AsyncSession) -> dict[str, str]:
    admin = await users_crud.create(
        db_session,
        email="admin@petone.com",
        hashed_password=hash_password("adminpass1"),
        full_name="Site Admin",
        is_admin=True,
    )
    return {"Authorization": f"Bearer {create_access_token(admin.id)}"}


@pytest_asyncio.fixture
async def user_headers(db_session: AsyncSession) -> dict[str, str]:
    user = await users_crud.create(
        db_session,
        email="user@petone.com",
        hashed_password=hash_password("userpass1"),
        full_name="Regular User",
    )
    return {"Authorization": f"Bearer {create_access_token(user.id)}"}
