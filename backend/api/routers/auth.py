"""Auth endpoints."""

from fastapi import APIRouter, Depends, Response

from api.deps import (
    get_current_user,
    get_login,
    get_logout,
    get_refresh_use_case,
    get_register,
)
from api.schemas.auth import (
    AuthResponse,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from domain.entities import User

router = APIRouter(prefix="/auth", tags=["auth"])


def _auth_response(user: User, tokens) -> AuthResponse:
    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
        ),
    )


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(body: RegisterRequest, use_case=Depends(get_register)) -> AuthResponse:
    user, tokens = await use_case.execute(
        email=body.email,
        password=body.password,
        customer_type=body.customer_type,
        preferred_language=body.preferred_language,
        company_name=body.company_name,
    )
    return _auth_response(user, tokens)


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, use_case=Depends(get_login)) -> AuthResponse:
    user, tokens = await use_case.execute(body.email, body.password)
    return _auth_response(user, tokens)


@router.post("/refresh", response_model=AuthResponse)
async def refresh(body: RefreshRequest, use_case=Depends(get_refresh_use_case)) -> AuthResponse:
    user, tokens = await use_case.execute(body.refresh_token)
    return _auth_response(user, tokens)


@router.post("/logout", status_code=204)
async def logout(body: LogoutRequest, use_case=Depends(get_logout)) -> Response:
    await use_case.execute(body.refresh_token)
    return Response(status_code=204)


@router.get("/me", response_model=UserResponse)
async def me(user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(user)
