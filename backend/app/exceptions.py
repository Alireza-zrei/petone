"""Custom exception classes for the Petone backend.

Every application error inherits from PetoneError. The mid-tier classes
(NotFoundError, ConflictError, AuthError, ForbiddenError) let app/main.py
register one exception handler per HTTP status that covers all domains.
Domain-specific errors are grouped below.
"""


class PetoneError(Exception):
    """Base class for all application-specific errors."""


class NotFoundError(PetoneError):
    """A requested resource does not exist (maps to HTTP 404)."""


class ConflictError(PetoneError):
    """An operation conflicts with existing data (maps to HTTP 409)."""


class AuthError(PetoneError):
    """Authentication failed or a token is invalid (maps to HTTP 401)."""


class ForbiddenError(PetoneError):
    """The caller is authenticated but lacks permission (maps to HTTP 403)."""


# --- Products ---


class ProductNotFound(NotFoundError):
    def __init__(self, product_id: int) -> None:
        super().__init__(f"Product {product_id} not found")
        self.product_id = product_id


class ProductSlugTaken(ConflictError):
    def __init__(self, slug: str) -> None:
        super().__init__(f"Product slug '{slug}' is already in use")
        self.slug = slug


# --- Auth & users ---


class InvalidCredentials(AuthError):
    def __init__(self) -> None:
        super().__init__("Incorrect email or password")


class InvalidToken(AuthError):
    """A token is missing, malformed, expired, or of the wrong type."""


class EmailAlreadyRegistered(ConflictError):
    def __init__(self, email: str) -> None:
        super().__init__(f"Email '{email}' is already registered")
        self.email = email


class InactiveUser(ForbiddenError):
    def __init__(self) -> None:
        super().__init__("This user account is inactive")


class AdminRequired(ForbiddenError):
    def __init__(self) -> None:
        super().__init__("Administrator privileges are required")


# --- Cart & orders ---


class OrderNotFound(NotFoundError):
    def __init__(self, order_id: int) -> None:
        super().__init__(f"Order {order_id} not found")
        self.order_id = order_id


class CartItemNotFound(NotFoundError):
    def __init__(self, product_id: int) -> None:
        super().__init__(f"Product {product_id} is not in the cart")
        self.product_id = product_id


class EmptyCart(ConflictError):
    def __init__(self) -> None:
        super().__init__("Cannot checkout an empty cart")


class InsufficientStock(ConflictError):
    def __init__(self, product_id: int, requested: int, available: int) -> None:
        super().__init__(
            f"Product {product_id}: requested {requested}, only {available} in stock"
        )
        self.product_id = product_id


# --- Payments ---


class PaymentNotFound(NotFoundError):
    def __init__(self, authority: str) -> None:
        super().__init__("Payment not found")
        self.authority = authority


class OrderNotPayable(ConflictError):
    def __init__(self, order_id: int, current_status: str) -> None:
        super().__init__(
            f"Order {order_id} is not payable (current status: {current_status})"
        )
        self.order_id = order_id
