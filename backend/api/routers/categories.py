"""Category endpoints."""

from fastapi import APIRouter, Depends

from api.deps import get_list_categories
from api.schemas.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(use_case=Depends(get_list_categories)) -> list[CategoryResponse]:
    return [CategoryResponse.model_validate(c) for c in await use_case.execute()]
