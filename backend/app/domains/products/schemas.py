from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

SLUG_PATTERN = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=SLUG_PATTERN)
    description: str | None = None
    price: int = Field(ge=0, description="Price in cents")
    category: str = Field(min_length=1, max_length=100)
    stock: int = Field(default=0, ge=0)
    image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    slug: str | None = Field(default=None, min_length=1, max_length=255, pattern=SLUG_PATTERN)
    description: str | None = None
    price: int | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = None


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
