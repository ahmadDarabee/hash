"""Admin endpoints (v1 minimal)."""

import datetime as dt
import uuid

from fastapi import APIRouter, Depends, File, Form, Query, Response, UploadFile

from api.deps import (
    get_admin_assign_pricing,
    get_admin_create_product,
    get_admin_create_sds,
    get_admin_list_products,
    get_admin_list_users,
    get_admin_update_product,
    require_admin,
)
from api.schemas.admin import AssignPricingRequest, ProductCreate, ProductUpdate
from api.schemas.auth import UserResponse
from api.schemas.common import Paginated
from api.schemas.product import ProductResponse, SdsResponse
from domain.enums import Language

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin)],
)


@router.get("/products", response_model=Paginated[ProductResponse])
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    query: str | None = Query(None),
    use_case=Depends(get_admin_list_products),
) -> dict:
    items, total, page, page_size = await use_case.execute(
        page=page, page_size=page_size, query=query
    )
    return {
        "items": [ProductResponse.model_validate(p) for p in items],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(
    body: ProductCreate, use_case=Depends(get_admin_create_product)
) -> ProductResponse:
    product = await use_case.execute(
        sku=body.sku,
        name_en=body.name_en,
        name_ar=body.name_ar,
        description_en=body.description_en,
        description_ar=body.description_ar,
        category_id=body.category_id,
        brand=body.brand,
        unit=body.unit,
        kind=body.kind,
    )
    return ProductResponse.model_validate(product)


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: uuid.UUID,
    body: ProductUpdate,
    use_case=Depends(get_admin_update_product),
) -> ProductResponse:
    product = await use_case.execute(product_id, body.model_dump(exclude_none=True))
    return ProductResponse.model_validate(product)


@router.post("/sds", response_model=SdsResponse, status_code=201)
async def create_sds(
    file: UploadFile = File(...),
    product_id: uuid.UUID = Form(...),
    language: Language = Form(...),
    version: str = Form(...),
    issued_at: dt.date = Form(...),
    revision_notes: str | None = Form(None),
    use_case=Depends(get_admin_create_sds),
) -> SdsResponse:
    data = await file.read()
    sds = await use_case.execute(
        product_id=product_id,
        language=language,
        version=version,
        issued_at=issued_at,
        revision_notes=revision_notes,
        filename=file.filename or "document.pdf",
        data=data,
        content_type=file.content_type or "application/pdf",
    )
    return SdsResponse.model_validate(sds)


@router.get("/users", response_model=Paginated[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    use_case=Depends(get_admin_list_users),
) -> dict:
    items, total, page, page_size = await use_case.execute(page, page_size)
    return {
        "items": [UserResponse.model_validate(u) for u in items],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.put("/users/{user_id}/pricing", status_code=204)
async def assign_pricing(
    user_id: uuid.UUID,
    body: AssignPricingRequest,
    use_case=Depends(get_admin_assign_pricing),
) -> Response:
    await use_case.execute(user_id, body.price_list_id)
    return Response(status_code=204)
