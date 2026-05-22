from pydantic import BaseModel


class PaymentInitiateResponse(BaseModel):
    payment_url: str
    authority: str
