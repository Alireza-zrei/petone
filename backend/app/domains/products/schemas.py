from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

SLUG_PATTERN = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=SLUG_PATTERN)
    description: str | None = None
    price: int = Field(ge=0, description="Price in Toman")
    category: str = Field(min_length=1, max_length=100)
    stock: int = Field(default=0, ge=0)
    image_url: str | None = None
    brand: str = Field(min_length=1, max_length=255)
    discount_price: int | None = Field(default=None, ge=0)
    rating: float = Field(default=0.0, ge=0, le=5)
    reviews_count: int = Field(default=0, ge=0)
    is_new: bool = False
    is_best_seller: bool = False


class ProductCreate(ProductBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Chew Toy",
                "slug": "chew-toy",
                "description": "Durable rubber chew toy for dogs.",
                "price": 129000,
                "category": "toys",
                "stock": 25,
                "image_url": "https://example.com/chew-toy.png",
                "brand": "PetOne",
                "discount_price": 99000,
                "rating": 4.5,
                "reviews_count": 12,
                "is_new": True,
                "is_best_seller": False,
            }
        }
    )


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    slug: str | None = Field(default=None, min_length=1, max_length=255, pattern=SLUG_PATTERN)
    description: str | None = None
    price: int | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = None
    brand: str | None = Field(default=None, min_length=1, max_length=255)
    discount_price: int | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0, le=5)
    reviews_count: int | None = Field(default=None, ge=0)
    is_new: bool | None = None
    is_best_seller: bool | None = None


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
