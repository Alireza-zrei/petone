import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.products import crud
from app.domains.products.models import Product
from app.domains.products.schemas import ProductCreate, ProductUpdate
from app.exceptions import ProductNotFound, ProductSlugTaken

logger = logging.getLogger(__name__)


async def get_product(db: AsyncSession, product_id: int) -> Product:
    product = await crud.get(db, product_id)
    if product is None:
        raise ProductNotFound(product_id)
    return product


async def list_products(db: AsyncSession, *, skip: int = 0, limit: int = 50) -> list[Product]:
    return await crud.list_products(db, skip=skip, limit=limit)


async def create_product(db: AsyncSession, data: ProductCreate) -> Product:
    if await crud.get_by_slug(db, data.slug) is not None:
        raise ProductSlugTaken(data.slug)
    product = await crud.create(db, data)
    logger.info("Created product id=%s slug=%s", product.id, product.slug)
    return product


async def update_product(db: AsyncSession, product_id: int, data: ProductUpdate) -> Product:
    product = await get_product(db, product_id)
    if data.slug is not None and data.slug != product.slug:
        if await crud.get_by_slug(db, data.slug) is not None:
            raise ProductSlugTaken(data.slug)
    product = await crud.update(db, product, data)
    logger.info("Updated product id=%s", product.id)
    return product


async def delete_product(db: AsyncSession, product_id: int) -> None:
    product = await get_product(db, product_id)
    await crud.soft_delete(db, product)
    logger.info("Soft-deleted product id=%s", product_id)
