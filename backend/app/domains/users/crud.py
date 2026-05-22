from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.users.models import User


async def get(db: AsyncSession, user_id: int) -> User | None:
    return await db.get(User, user_id)


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def create(
    db: AsyncSession,
    *,
    email: str,
    hashed_password: str,
    full_name: str,
    is_admin: bool = False,
) -> User:
    user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        is_admin=is_admin,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
