"""Domain enumerations. Stored as text in the database."""

from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    CUSTOMER_B2B = "customer_b2b"
    CUSTOMER_B2C = "customer_b2c"


class CustomerType(str, Enum):
    B2C = "b2c"
    B2B = "b2b"


class Language(str, Enum):
    AR = "ar"
    EN = "en"


class ProductKind(str, Enum):
    RAW = "raw"
    FINISHED = "finished"


class OrderStatus(str, Enum):
    DRAFT = "draft"
    CONFIRMED = "confirmed"
    FULFILLED = "fulfilled"
    CANCELLED = "cancelled"


class InventoryMovementType(str, Enum):
    IN = "in"
    OUT = "out"
    ADJUST = "adjust"


class WarningSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    DANGER = "danger"


class QuoteStatus(str, Enum):
    NEW = "new"
    REVIEWED = "reviewed"
    RESPONDED = "responded"
    CLOSED = "closed"
