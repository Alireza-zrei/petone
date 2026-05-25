import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.orders import crud
from app.domains.orders.models import Cart, CartItem, Order, OrderItem, OrderStatus
from app.domains.orders.schemas import CartItemCreate, CartItemRead, CartRead, OrderRead
from app.domains.products import service as products_service
from app.exceptions import (
    CartItemNotFound,
    EmptyCart,
    InsufficientStock,
    OrderNotFound,
    ProductDiscontinued,
)

logger = logging.getLogger(__name__)


def _build_cart_read(cart: Cart) -> CartRead:
    items = [
        CartItemRead(
            product_id=item.product_id,
            product_name=item.product.name,
            unit_price=item.product.price,
            quantity=item.quantity,
        )
        for item in cart.items
    ]
    return CartRead(items=items)


async def _get_or_create_cart(db: AsyncSession, user_id: int) -> Cart:
    cart = await crud.get_cart(db, user_id)
    if cart is None:
        cart = await crud.create_cart(db, user_id)
    return cart


async def get_cart(db: AsyncSession, user_id: int) -> CartRead:
    cart = await crud.get_cart(db, user_id)
    if cart is None:
        return CartRead(items=[])
    return _build_cart_read(cart)


async def add_item(db: AsyncSession, user_id: int, data: CartItemCreate) -> CartRead:
    product = await products_service.get_product(db, data.product_id)
    cart = await _get_or_create_cart(db, user_id)
    existing = await crud.get_cart_item(db, cart.id, product.id)
    if existing is not None:
        existing.quantity += data.quantity
    else:
        # Append via the relationship (not bare db.add) so the in-memory
        # Cart.items collection stays consistent with what we just inserted.
        cart.items.append(CartItem(product_id=product.id, quantity=data.quantity))
    await db.commit()
    # `expire_on_commit=False` means the previously-loaded items collection
    # would otherwise be returned as-was; refresh to pick up new rows along
    # with their eagerly-loaded product relationship.
    await db.refresh(cart, ["items"])
    return _build_cart_read(cart)


async def remove_item(db: AsyncSession, user_id: int, product_id: int) -> CartRead:
    cart = await crud.get_cart(db, user_id)
    item = None if cart is None else await crud.get_cart_item(db, cart.id, product_id)
    if item is None:
        raise CartItemNotFound(product_id)
    await db.delete(item)
    await db.commit()
    await db.refresh(cart, ["items"])
    return _build_cart_read(cart)


async def checkout(db: AsyncSession, user_id: int) -> OrderRead:
    cart = await crud.get_cart(db, user_id)
    if cart is None or not cart.items:
        raise EmptyCart
    order_items: list[OrderItem] = []
    total = 0
    for item in cart.items:
        product = item.product
        if product.deleted_at is not None:
            raise ProductDiscontinued(product.id)
        if product.stock < item.quantity:
            raise InsufficientStock(product.id, item.quantity, product.stock)
        product.stock -= item.quantity
        total += product.price * item.quantity
        order_items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                unit_price=product.price,
                quantity=item.quantity,
            )
        )
    order = Order(
        user_id=user_id,
        status=OrderStatus.PENDING,
        total_cents=total,
        items=order_items,
    )
    db.add(order)
    cart.items.clear()
    await db.commit()
    logger.info("Checked out order id=%s total=%s", order.id, total)
    fresh = await crud.get_order(db, order.id, user_id)
    return OrderRead.model_validate(fresh)


async def list_user_orders(db: AsyncSession, user_id: int) -> list[OrderRead]:
    orders = await crud.list_orders(db, user_id)
    return [OrderRead.model_validate(order) for order in orders]


async def get_order_for_user(db: AsyncSession, order_id: int, user_id: int) -> OrderRead:
    order = await crud.get_order(db, order_id, user_id)
    if order is None:
        raise OrderNotFound(order_id)
    return OrderRead.model_validate(order)


async def mark_order_paid(db: AsyncSession, order_id: int) -> None:
    order = await crud.get_order_by_id(db, order_id)
    if order is None:
        raise OrderNotFound(order_id)
    order.status = OrderStatus.PAID
    await db.commit()
    logger.info("Order id=%s marked paid", order_id)
