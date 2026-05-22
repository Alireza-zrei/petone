from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.dependencies import DbSession, get_current_admin
from app.domains.products import service
from app.domains.products.models import Product
from app.domains.products.schemas import ProductCreate, ProductRead, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductRead])
async def list_products(
    db: DbSession,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
) -> list[Product]:
    return await service.list_products(db, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: int, db: DbSession) -> Product:
    return await service.get_product(db, product_id)


@router.post(
    "",
    response_model=ProductRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin)],
)
async def create_product(data: ProductCreate, db: DbSession) -> Product:
    return await service.create_product(db, data)


@router.patch(
    "/{product_id}",
    response_model=ProductRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_product(product_id: int, data: ProductUpdate, db: DbSession) -> Product:
    return await service.update_product(db, product_id, data)


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin)],
)
async def delete_product(product_id: int, db: DbSession) -> None:
    await service.delete_product(db, product_id)
