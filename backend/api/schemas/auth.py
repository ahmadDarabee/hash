"""Auth request/response schemas."""

import datetime as dt
import uuid

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from domain.enums import CustomerType, Language, Role


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    customer_type: CustomerType
    preferred_language: Language = Language.AR
    company_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    role: Role
    customer_type: CustomerType
    preferred_language: Language
    company_name: str | None = None
    is_active: bool = True
    created_at: dt.datetime | None = None


class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse
