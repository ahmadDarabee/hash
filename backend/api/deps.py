"""FastAPI dependency injection: repositories, use cases, providers, auth guards."""

import uuid

import asyncpg
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from application.ports.notification import NotificationProvider
from application.ports.payment import PaymentProvider
from application.ports.storage import StorageAdapter
from application.ports.tracking import OrderTrackingProvider
from application.ports.wojak import WojakChatService
from application.use_cases.admin.assign_pricing import AdminAssignPricing
from application.use_cases.admin.create_product import AdminCreateProduct
from application.use_cases.admin.create_sds import AdminCreateSds
from application.use_cases.admin.list_products import AdminListProducts
from application.use_cases.admin.list_users import AdminListUsers
from application.use_cases.admin.update_product import AdminUpdateProduct
from application.use_cases.auth.login import Login
from application.use_cases.auth.logout import Logout
from application.use_cases.auth.refresh import Refresh
from application.use_cases.auth.register import Register
from application.use_cases.catalog.get_product import GetProduct
from application.use_cases.catalog.get_sds import GetProductSds
from application.use_cases.catalog.get_warnings import GetProductWarnings
from application.use_cases.catalog.list_categories import ListCategories
from application.use_cases.catalog.list_products import ListProducts
from application.use_cases.pricing.get_effective_pricing import GetEffectivePricing
from application.use_cases.quotes.request_quote import RequestQuote
from application.use_cases.wojak.chat import WojakChat
from core.config import get_settings
from core.security import decode_access_token
from domain.entities import User
from domain.enums import Role
from domain.errors import AuthenticationError, AuthorizationError
from infrastructure.adapters.local_storage import LocalDiskStorage
from infrastructure.adapters.noop_notification import NoopNotificationProvider
from infrastructure.adapters.noop_payment import NoopPaymentProvider
from infrastructure.adapters.noop_tracking import NoopOrderTrackingProvider
from infrastructure.adapters.rule_based_wojak import RuleBasedWojakChatService
from infrastructure.repositories.category_repository import CategoryRepository
from infrastructure.repositories.compliance_repository import ComplianceRepository
from infrastructure.repositories.inventory_repository import InventoryRepository
from infrastructure.repositories.pricing_repository import PricingRepository
from infrastructure.repositories.product_repository import ProductRepository
from infrastructure.repositories.quote_repository import QuoteRepository
from infrastructure.repositories.refresh_token_repository import RefreshTokenRepository
from infrastructure.repositories.user_repository import UserRepository


# --- Infrastructure ---------------------------------------------------------


async def get_pool(request: Request) -> asyncpg.Pool:
    return request.app.state.pool


def get_user_repository(pool: asyncpg.Pool = Depends(get_pool)) -> UserRepository:
    return UserRepository(pool)


def get_refresh_token_repository(pool: asyncpg.Pool = Depends(get_pool)) -> RefreshTokenRepository:
    return RefreshTokenRepository(pool)


def get_product_repository(pool: asyncpg.Pool = Depends(get_pool)) -> ProductRepository:
    return ProductRepository(pool)


def get_category_repository(pool: asyncpg.Pool = Depends(get_pool)) -> CategoryRepository:
    return CategoryRepository(pool)


def get_pricing_repository(pool: asyncpg.Pool = Depends(get_pool)) -> PricingRepository:
    return PricingRepository(pool)


def get_compliance_repository(pool: asyncpg.Pool = Depends(get_pool)) -> ComplianceRepository:
    return ComplianceRepository(pool)


def get_quote_repository(pool: asyncpg.Pool = Depends(get_pool)) -> QuoteRepository:
    return QuoteRepository(pool)


def get_inventory_repository(pool: asyncpg.Pool = Depends(get_pool)) -> InventoryRepository:
    return InventoryRepository(pool)


def get_storage() -> StorageAdapter:
    return LocalDiskStorage(get_settings().sds_upload_dir)


def get_wojak_service() -> WojakChatService:
    return RuleBasedWojakChatService()


def get_payment_provider() -> PaymentProvider:
    return NoopPaymentProvider()


def get_tracking_provider() -> OrderTrackingProvider:
    return NoopOrderTrackingProvider()


def get_notification_provider() -> NotificationProvider:
    return NoopNotificationProvider()


# --- Use cases ---------------------------------------------------------------


def get_register(
    users: UserRepository = Depends(get_user_repository),
    refresh_tokens: RefreshTokenRepository = Depends(get_refresh_token_repository),
) -> Register:
    return Register(users, refresh_tokens)


def get_login(
    users: UserRepository = Depends(get_user_repository),
    refresh_tokens: RefreshTokenRepository = Depends(get_refresh_token_repository),
) -> Login:
    return Login(users, refresh_tokens)


def get_refresh_use_case(
    users: UserRepository = Depends(get_user_repository),
    refresh_tokens: RefreshTokenRepository = Depends(get_refresh_token_repository),
) -> Refresh:
    return Refresh(users, refresh_tokens)


def get_logout(
    refresh_tokens: RefreshTokenRepository = Depends(get_refresh_token_repository),
) -> Logout:
    return Logout(refresh_tokens)


def get_list_products(
    products: ProductRepository = Depends(get_product_repository),
) -> ListProducts:
    return ListProducts(products)


def get_product(
    products: ProductRepository = Depends(get_product_repository),
) -> GetProduct:
    return GetProduct(products)


def get_product_sds(
    compliance: ComplianceRepository = Depends(get_compliance_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> GetProductSds:
    return GetProductSds(compliance, products)


def get_product_warnings(
    compliance: ComplianceRepository = Depends(get_compliance_repository),
    products: ProductRepository = Depends(get_product_repository),
) -> GetProductWarnings:
    return GetProductWarnings(compliance, products)


def get_list_categories(
    categories: CategoryRepository = Depends(get_category_repository),
) -> ListCategories:
    return ListCategories(categories)


def get_effective_pricing(
    pricing: PricingRepository = Depends(get_pricing_repository),
) -> GetEffectivePricing:
    return GetEffectivePricing(pricing)


def get_request_quote(
    quotes: QuoteRepository = Depends(get_quote_repository),
) -> RequestQuote:
    return RequestQuote(quotes)


def get_admin_list_products(
    products: ProductRepository = Depends(get_product_repository),
) -> AdminListProducts:
    return AdminListProducts(products)


def get_admin_create_product(
    products: ProductRepository = Depends(get_product_repository),
) -> AdminCreateProduct:
    return AdminCreateProduct(products)


def get_admin_update_product(
    products: ProductRepository = Depends(get_product_repository),
) -> AdminUpdateProduct:
    return AdminUpdateProduct(products)


def get_admin_create_sds(
    compliance: ComplianceRepository = Depends(get_compliance_repository),
    products: ProductRepository = Depends(get_product_repository),
    storage: StorageAdapter = Depends(get_storage),
) -> AdminCreateSds:
    return AdminCreateSds(compliance, products, storage)


def get_admin_list_users(
    users: UserRepository = Depends(get_user_repository),
) -> AdminListUsers:
    return AdminListUsers(users)


def get_admin_assign_pricing(
    users: UserRepository = Depends(get_user_repository),
    pricing: PricingRepository = Depends(get_pricing_repository),
) -> AdminAssignPricing:
    return AdminAssignPricing(users, pricing)


def get_wojak_chat(
    service: WojakChatService = Depends(get_wojak_service),
) -> WojakChat:
    return WojakChat(service)


# --- Auth guards -------------------------------------------------------------

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    users: UserRepository = Depends(get_user_repository),
) -> User:
    if credentials is None:
        raise AuthenticationError("Missing authentication credentials", "missing_token")

    payload = decode_access_token(credentials.credentials)
    user = await users.get_by_id(uuid.UUID(payload["sub"]))
    if user is None or not user.is_active:
        raise AuthenticationError("Invalid or inactive user", "token_invalid")
    return user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    users: UserRepository = Depends(get_user_repository),
) -> User | None:
    if credentials is None:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
    except AuthenticationError:
        return None
    return await users.get_by_id(uuid.UUID(payload["sub"]))


def require_role(*roles: str):
    async def _dependency(user: User = Depends(get_current_user)) -> User:
        if user.role.value not in roles:
            raise AuthorizationError("Insufficient permissions")
        return user

    return _dependency


require_admin = require_role(Role.ADMIN.value)
