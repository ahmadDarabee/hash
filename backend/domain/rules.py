"""Domain rules (pure functions, no framework imports)."""

from decimal import Decimal

from domain.enums import InventoryMovementType
from domain.errors import ValidationError


def apply_inventory_change(
    current_qty: Decimal, movement_type: InventoryMovementType, qty: Decimal
) -> Decimal:
    """Compute the new on-hand quantity for a movement.

    `in` adds, `out` subtracts (cannot go negative), `adjust` sets an absolute value.
    """
    if qty < 0:
        raise ValidationError("Movement quantity cannot be negative")

    if movement_type is InventoryMovementType.IN:
        return current_qty + qty
    if movement_type is InventoryMovementType.OUT:
        new_qty = current_qty - qty
        if new_qty < 0:
            raise ValidationError("Insufficient stock for this movement")
        return new_qty
    if movement_type is InventoryMovementType.ADJUST:
        return qty

    raise ValidationError(f"Unknown movement type: {movement_type}")
