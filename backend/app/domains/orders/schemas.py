from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, computed_field

from app.domains.orders.models import OrderStatus


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=1000)


class CartItemRead(BaseModel):
    product_id: int
    product_name: str
    unit_price: int
    quantity: int

    @computed_field
    @property
    def subtotal(self) -> int:
        return self.unit_price * self.quantity


class CartRead(BaseModel):
    items: list[CartItemRead]

    @computed_field
    @property
    def total(self) -> int:
        return sum(item.subtotal for item in self.items)


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    product_name: str
    unit_price: int
    quantity: int

    @computed_field
    @property
    def subtotal(self) -> int:
        return self.unit_price * self.quantity


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    total_cents: int
    created_at: datetime
    items: list[OrderItemRead]
