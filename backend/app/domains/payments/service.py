import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.orders import crud as orders_crud
from app.domains.orders import service as orders_service
from app.domains.orders.models import OrderStatus
from app.domains.payments import crud
from app.domains.payments.gateway import get_payment_gateway
from app.domains.payments.models import PaymentStatus
from app.domains.payments.schemas import PaymentInitiateResponse
from app.exceptions import OrderNotFound, OrderNotPayable, PaymentNotFound

logger = logging.getLogger(__name__)

GATEWAY_SUCCESS_STATUS = "OK"


async def initiate_payment(
    db: AsyncSession, user_id: int, order_id: int, callback_url: str
) -> PaymentInitiateResponse:
    order = await orders_crud.get_order(db, order_id, user_id)
    if order is None:
        raise OrderNotFound(order_id)
    if order.status != OrderStatus.PENDING:
        raise OrderNotPayable(order_id, order.status)
    gateway = get_payment_gateway()
    request = await gateway.request_payment(
        amount=order.total_cents, order_id=order.id, callback_url=callback_url
    )
    await crud.create(
        db,
        order_id=order.id,
        amount=order.total_cents,
        gateway=gateway.name,
        authority=request.authority,
    )
    logger.info("Payment initiated for order id=%s gateway=%s", order.id, gateway.name)
    return PaymentInitiateResponse(
        payment_url=request.payment_url, authority=request.authority
    )


async def handle_callback(
    db: AsyncSession, authority: str, gateway_status: str
) -> tuple[bool, int]:
    payment = await crud.get_by_authority(db, authority)
    if payment is None:
        raise PaymentNotFound(authority)
    if payment.status == PaymentStatus.SUCCEEDED:
        return True, payment.order_id  # idempotent: already settled
    if gateway_status != GATEWAY_SUCCESS_STATUS:
        payment.status = PaymentStatus.FAILED
        await db.commit()
        logger.info("Payment authority=%s reported as failed by gateway", authority)
        return False, payment.order_id
    gateway = get_payment_gateway()
    result = await gateway.verify_payment(authority=authority, amount=payment.amount)
    if not result.success:
        payment.status = PaymentStatus.FAILED
        await db.commit()
        logger.info("Payment authority=%s failed verification", authority)
        return False, payment.order_id
    payment.status = PaymentStatus.SUCCEEDED
    payment.ref_id = result.ref_id
    # mark_order_paid commits, flushing the payment update in the same transaction.
    await orders_service.mark_order_paid(db, payment.order_id)
    logger.info("Payment authority=%s verified; order id=%s paid", authority, payment.order_id)
    return True, payment.order_id
