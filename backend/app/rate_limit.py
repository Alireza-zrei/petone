from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared limiter. Lives in its own module so both main.py (wiring) and the
# auth router (the @limiter.limit decorators) can import it without a cycle.
limiter = Limiter(key_func=get_remote_address)
