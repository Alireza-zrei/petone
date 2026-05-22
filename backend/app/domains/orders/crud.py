from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.orders.models import Cart, CartItem, Order


async def get_cart(db: AsyncSession, user_id: int) -> Cart | None:
    result = await db.execute(select(Cart).where(Cart.user_id == user_id))
    return result.scalar_one_or_none()


async def create_cart(db: AsyncSession, user_id: int) -> Cart:
    cart = Cart(user_id=user_id)
    db.add(cart)
    await db.commit()
    await db.refresh(cart)
    return cart


async def get_cart_item(db: AsyncSession, cart_id: int, product_id: int) -> CartItem | None:
    result = await db.execute(
        select(CartItem).where(
            CartItem.cart_id == cart_id, CartItem.product_id == product_id
        )
    )
    return result.scalar_one_or_none()


async def list_orders(db: AsyncSession, user_id: int) -> list[Order]:
    result = await db.execute(
        select(Order).where(Order.user_id == user_id).order_by(Order.id.desc())
    )
    return list(result.scalars().all())


async def get_order(db: AsyncSession, order_id: int, user_id: int) -> Order | None:
    result = await db.execute(
        select(Order).where(Order.id == order_id, Order.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def get_order_by_id(db: AsyncSession, order_id: int) -> Order | None:
    return await db.get(Order, order_id)
