from dataclasses import dataclass
from typing import Protocol
from uuid import uuid4

from app.config import settings


@dataclass
class PaymentRequest:
    authority: str    # gateway token identifying this payment
    payment_url: str  # URL to redirect the user's browser to


@dataclass
class VerificationResult:
    success: bool
    ref_id: str | None  # gateway transaction reference, set on success


class PaymentGateway(Protocol):
    """Interface every payment gateway adapter must satisfy."""

    name: str

    async def request_payment(
        self, *, amount: int, order_id: int, callback_url: str
    ) -> PaymentRequest: ...

    async def verify_payment(
        self, *, authority: str, amount: int
    ) -> VerificationResult: ...


class FakePaymentGateway:
    """In-process gateway for development and tests.

    Mimics the Iranian redirect flow with no external HTTP: request_payment
    mints an authority and a payment_url pointing straight back at our own
    callback, so the redirect round-trip is exercised end to end.
    """

    name = "fake"

    async def request_payment(
        self, *, amount: int, order_id: int, callback_url: str
    ) -> PaymentRequest:
        authority = f"FAKE-{uuid4().hex}"
        payment_url = f"{callback_url}?authority={authority}&status=OK"
        return PaymentRequest(authority=authority, payment_url=payment_url)

    async def verify_payment(
        self, *, authority: str, amount: int
    ) -> VerificationResult:
        return VerificationResult(success=True, ref_id=f"REF-{authority[-12:]}")


class ShaparakGateway:
    """Real Iranian payment-gateway adapter (Shaparak via a PSP / bank IPG).

    Pending the integration URL and credentials. Both methods must call the
    gateway's HTTP endpoints (use httpx.AsyncClient — promote httpx to
    requirements.txt when implementing) and map the responses onto
    PaymentRequest / VerificationResult.
    """

    name = "shaparak"

    def __init__(self, base_url: str, merchant_id: str) -> None:
        self._base_url = base_url
        self._merchant_id = merchant_id

    async def request_payment(
        self, *, amount: int, order_id: int, callback_url: str
    ) -> PaymentRequest:
        raise NotImplementedError(
            "ShaparakGateway.request_payment — provide the integration URL"
        )

    async def verify_payment(
        self, *, authority: str, amount: int
    ) -> VerificationResult:
        raise NotImplementedError(
            "ShaparakGateway.verify_payment — provide the integration URL"
        )


def get_payment_gateway() -> PaymentGateway:
    """Return the configured gateway. Defaults to the fake in-process gateway."""
    if settings.payment_gateway == "shaparak":
        return ShaparakGateway(
            base_url=settings.shaparak_base_url,
            merchant_id=settings.shaparak_merchant_id,
        )
    return FakePaymentGateway()
