from typing import Annotated

from fastapi import APIRouter, Query, Request, status
from fastapi.responses import RedirectResponse

from app.config import settings
from app.dependencies import CurrentUser, DbSession
from app.domains.payments import service
from app.domains.payments.schemas import PaymentInitiateResponse

router = APIRouter(tags=["payments"])


@router.post(
    "/orders/{order_id}/pay",
    response_model=PaymentInitiateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def pay_order(
    order_id: int, request: Request, user: CurrentUser, db: DbSession
) -> PaymentInitiateResponse:
    """Start payment for a pending order; returns the gateway URL to redirect to."""
    callback_url = str(request.url_for("payment_callback"))
    return await service.initiate_payment(db, user.id, order_id, callback_url)


@router.get("/payments/callback", name="payment_callback")
async def payment_callback(
    authority: str,
    gateway_status: Annotated[str, Query(alias="status")],
    db: DbSession,
) -> RedirectResponse:
    """Gateway redirect target: verify the payment and redirect to the frontend."""
    success, order_id = await service.handle_callback(db, authority, gateway_status)
    result = "success" if success else "failed"
    url = f"{settings.frontend_url}/payment/result?status={result}&order_id={order_id}"
    return RedirectResponse(url, status_code=status.HTTP_303_SEE_OTHER)
