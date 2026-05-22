"""Custom exception classes for the Petone backend.

Domain-specific exceptions (e.g. ProductNotFound, EmailAlreadyRegistered) are
added to their respective domains as the project grows. They should all inherit
from PetoneError so the application can catch and translate them uniformly.
"""


class PetoneError(Exception):
    """Base class for all application-specific errors."""
