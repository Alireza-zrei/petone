from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.payments.models import Payment


async def create(
    db: AsyncSession, *, order_id: int, amount: int, gateway: str, authority: str
) -> Payment:
    payment = Payment(
        order_id=order_id, amount=amount, gateway=gateway, authority=authority
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)
    return payment


async def get_by_authority(db: AsyncSession, authority: str) -> Payment | None:
    result = await db.execute(select(Payment).where(Payment.authority == authority))
    return result.scalar_one_or_none()
