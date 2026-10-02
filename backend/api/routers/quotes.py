"""Quote request endpoints."""

from fastapi import APIRouter, Depends

from api.deps import get_optional_user, get_request_quote
from api.schemas.quote import QuoteRequestIn, QuoteResponse
from domain.entities import User

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.post("/request", response_model=QuoteResponse, status_code=201)
async def request_quote(
    body: QuoteRequestIn,
    user: User | None = Depends(get_optional_user),
    use_case=Depends(get_request_quote),
) -> QuoteResponse:
    quote = await use_case.execute(
        user_id=user.id if user else None,
        contact_name=body.contact_name,
        contact_email=body.contact_email,
        contact_phone=body.contact_phone,
        company_name=body.company_name,
        notes=body.notes,
    )
    return QuoteResponse.model_validate(quote)
