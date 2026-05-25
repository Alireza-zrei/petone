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


class TokenExpired(InvalidToken):
    """The JWT's `exp` claim is in the past."""

    def __init__(self, token_type: str = "token") -> None:
        super().__init__(f"{token_type.capitalize()} has expired")
        self.token_type = token_type


class TokenRevoked(InvalidToken):
    """The refresh token was previously revoked (logout or rotation)."""

    def __init__(self) -> None:
        super().__init__("Refresh token has been revoked")


class EmailAlreadyRegistered(ConflictError):
    def __init__(self, email: str) -> None:
        super().__init__(f"Email '{email}' is already registered")
        self.email = email


class PhoneAlreadyRegistered(ConflictError):
    def __init__(self, phone: str) -> None:
        super().__init__(f"Phone '{phone}' is already registered")
        self.phone = phone


class InvalidPhoneNumber(ConflictError):
    """The mobile number is not a recognizable Iranian phone (maps to HTTP 409
    on registration; routers reusing it elsewhere may catch and rewrap)."""

    def __init__(self, raw: str) -> None:
        super().__init__(f"'{raw}' is not a valid Iranian mobile number")
        self.raw = raw


class OtpInvalid(AuthError):
    """OTP is missing, wrong, expired, exhausted, or already consumed.

    Subclasses (NoPendingOtp, OtpExpired, OtpMaxAttemptsExceeded) preserve the
    same uniform user-facing message so attackers can't enumerate state, but
    differ by class so server logs distinguish them.
    """

    def __init__(self, reason: str = "OTP code is invalid or expired") -> None:
        super().__init__(reason)


class NoPendingOtp(OtpInvalid):
    """Verify was called but no unconsumed OTP exists for (mobile, purpose)."""


class OtpExpired(OtpInvalid):
    """The OTP exists but its expires_at is in the past."""


class OtpMaxAttemptsExceeded(OtpInvalid):
    """Too many wrong guesses against the same OTP — likely brute force."""


class OtpResendTooSoon(ConflictError):
    def __init__(self, retry_after_seconds: int) -> None:
        super().__init__(
            f"Please wait {retry_after_seconds}s before requesting a new code"
        )
        self.retry_after_seconds = retry_after_seconds


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


class ProductDiscontinued(NotFoundError):
    """Product still exists but is soft-deleted, so it can no longer be ordered."""

    def __init__(self, product_id: int) -> None:
        super().__init__(f"Product {product_id} is no longer available")
        self.product_id = product_id


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


class PaymentGatewayUnavailable(ConflictError):
    """Upstream payment gateway returned 5xx, timed out, or was unreachable.

    Wrap httpx errors raised from inside `PaymentGateway` adapters in this so
    log readers can distinguish infrastructure failure from a real declined
    payment. Mapped to 409 so the client knows the request didn't go through.
    """

    def __init__(self, gateway: str, detail: str = "gateway unreachable") -> None:
        super().__init__(f"Payment gateway '{gateway}' unavailable: {detail}")
        self.gateway = gateway


class UnsupportedPaymentGateway(PetoneError):
    """A payment gateway adapter was selected but has no implementation."""

    def __init__(self, gateway: str, operation: str) -> None:
        super().__init__(
            f"Payment gateway '{gateway}' does not implement {operation}"
        )
        self.gateway = gateway
        self.operation = operation
