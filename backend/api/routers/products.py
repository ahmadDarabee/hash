"""Public catalog endpoints."""

import uuid

from fastapi import APIRouter, Depends, Query

from api.deps import (
    get_list_products,
    get_product,
    get_product_sds,
    get_product_warnings,
)
from api.schemas.common import Paginated
from api.schemas.product import ProductResponse, SdsResponse, WarningResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=Paginated[ProductResponse])
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: int | None = Query(None),
    query: str | None = Query(None),
    use_case=Depends(get_list_products),
) -> dict:
    items, total, page, page_size = await use_case.execute(
        page=page,
        page_size=page_size,
        category_id=category_id,
        query=query,
    )
    return {
        "items": [ProductResponse.model_validate(p) for p in items],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: uuid.UUID, use_case=Depends(get_product)) -> ProductResponse:
    return ProductResponse.model_validate(await use_case.execute(product_id))


@router.get("/{product_id}/sds", response_model=list[SdsResponse])
async def get_product_sds(
    product_id: uuid.UUID, use_case=Depends(get_product_sds)
) -> list[SdsResponse]:
    return [SdsResponse.model_validate(s) for s in await use_case.execute(product_id)]


@router.get("/{product_id}/warnings", response_model=list[WarningResponse])
async def get_product_warnings(
    product_id: uuid.UUID, use_case=Depends(get_product_warnings)
) -> list[WarningResponse]:
    return [WarningResponse.model_validate(w) for w in await use_case.execute(product_id)]
