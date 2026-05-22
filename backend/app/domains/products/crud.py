from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.products.models import Product
from app.domains.products.schemas import ProductCreate, ProductUpdate


async def get(db: AsyncSession, product_id: int) -> Product | None:
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def get_by_slug(db: AsyncSession, slug: str) -> Product | None:
    result = await db.execute(
        select(Product).where(Product.slug == slug, Product.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def list_products(db: AsyncSession, *, skip: int = 0, limit: int = 50) -> list[Product]:
    result = await db.execute(
        select(Product)
        .where(Product.deleted_at.is_(None))
        .order_by(Product.id)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def create(db: AsyncSession, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update(db: AsyncSession, product: Product, data: ProductUpdate) -> Product:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return product


async def soft_delete(db: AsyncSession, product: Product) -> None:
    product.deleted_at = datetime.now(UTC)
    await db.commit()
