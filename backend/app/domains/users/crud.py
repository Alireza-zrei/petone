from datetime import datetime

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.users.models import RefreshToken, User


async def get(db: AsyncSession, user_id: int) -> User | None:
    return await db.get(User, user_id)


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_phone(db: AsyncSession, phone: str) -> User | None:
    result = await db.execute(select(User).where(User.phone == phone))
    return result.scalar_one_or_none()


async def create(
    db: AsyncSession,
    *,
    email: str,
    hashed_password: str,
    full_name: str,
    phone: str,
    is_admin: bool = False,
) -> User:
    user = User(
        email=email,
        phone=phone,
        hashed_password=hashed_password,
        full_name=full_name,
        is_admin=is_admin,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def update_password(
    db: AsyncSession, user: User, hashed_password: str
) -> None:
    user.hashed_password = hashed_password
    await db.commit()


# --- Refresh tokens ---


async def create_refresh_token(
    db: AsyncSession,
    *,
    user_id: int,
    token_hash: str,
    expires_at: datetime,
) -> RefreshToken:
    row = RefreshToken(
        user_id=user_id, token_hash=token_hash, expires_at=expires_at
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


async def get_refresh_token(
    db: AsyncSession, token_hash: str
) -> RefreshToken | None:
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    )
    return result.scalar_one_or_none()


async def revoke_refresh_token(
    db: AsyncSession, token: RefreshToken, *, now: datetime
) -> None:
    token.revoked_at = now
    await db.commit()


async def revoke_all_user_tokens(
    db: AsyncSession, user_id: int, *, now: datetime
) -> None:
    await db.execute(
        update(RefreshToken)
        .where(
            RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None)
        )
        .values(revoked_at=now)
    )
    await db.commit()
