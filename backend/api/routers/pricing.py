"""Pricing endpoints."""

from fastapi import APIRouter, Depends

from api.deps import get_current_user, get_effective_pricing
from api.schemas.pricing import PriceListItemResponse, PricingResponse
from domain.entities import User

router = APIRouter(prefix="/pricing", tags=["pricing"])


@router.get("/me", response_model=PricingResponse | None)
async def get_my_pricing(
    user: User = Depends(get_current_user),
    use_case=Depends(get_effective_pricing),
) -> PricingResponse | None:
    result = await use_case.execute(user)
    if result is None:
        return None

    price_list, items = result
    return PricingResponse(
        price_list_id=price_list.id,
        name=price_list.name,
        is_default=price_list.is_default,
        items=[
            PriceListItemResponse(
                product_id=item.product_id,
                price=item.price.amount,
                currency=item.price.currency,
                min_qty=item.min_qty,
                discount_pct=item.discount_pct,
            )
            for item in items
        ],
    )
