from fastapi import APIRouter, status

from app.dependencies import CurrentUser, DbSession
from app.domains.orders import service
from app.domains.orders.schemas import CartItemCreate, CartRead, OrderRead

router = APIRouter(tags=["cart & orders"])


@router.get("/cart", response_model=CartRead)
async def get_cart(user: CurrentUser, db: DbSession) -> CartRead:
    """Return the current user's cart with line items and totals."""
    return await service.get_cart(db, user.id)


@router.post("/cart/items", response_model=CartRead)
async def add_cart_item(
    data: CartItemCreate, user: CurrentUser, db: DbSession
) -> CartRead:
    """Add a product to the cart; an existing line's quantity is increased."""
    return await service.add_item(db, user.id, data)


@router.delete("/cart/items/{product_id}", response_model=CartRead)
async def remove_cart_item(
    product_id: int, user: CurrentUser, db: DbSession
) -> CartRead:
    """Remove a product's line from the cart."""
    return await service.remove_item(db, user.id, product_id)


@router.post("/orders", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def checkout(user: CurrentUser, db: DbSession) -> OrderRead:
    """Check out the cart: validate and decrement stock, create a pending order."""
    return await service.checkout(db, user.id)


@router.get("/orders", response_model=list[OrderRead])
async def list_orders(user: CurrentUser, db: DbSession) -> list[OrderRead]:
    """List the current user's orders, newest first."""
    return await service.list_user_orders(db, user.id)


@router.get("/orders/{order_id}", response_model=OrderRead)
async def get_order(order_id: int, user: CurrentUser, db: DbSession) -> OrderRead:
    """Fetch one of the current user's orders by id."""
    return await service.get_order_for_user(db, order_id, user.id)
