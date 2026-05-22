from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.dependencies import DbSession
from app.domains.orders.router import router as orders_router
from app.domains.payments.router import router as payments_router
from app.domains.products.router import router as products_router
from app.domains.users.router import router as auth_router
from app.exceptions import AuthError, ConflictError, ForbiddenError, NotFoundError
from app.observability import RequestIdMiddleware, configure_logging
from app.rate_limit import limiter

configure_logging()

OPENAPI_TAGS = [
    {"name": "products", "description": "Browse the catalog; admins create and edit products."},
    {"name": "auth", "description": "Registration, login, token refresh, and current user."},
    {"name": "cart & orders", "description": "Per-user shopping cart and order checkout."},
    {"name": "payments", "description": "Initiate a payment and handle the gateway callback."},
]

app = FastAPI(
    title=settings.app_name,
    description="Backend API for Petone — a pet products and accessory store.",
    version="0.1.0",
    openapi_tags=OPENAPI_TAGS,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestIdMiddleware)


@app.exception_handler(NotFoundError)
async def handle_not_found(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(exc)})


@app.exception_handler(ConflictError)
async def handle_conflict(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": str(exc)})


@app.exception_handler(AuthError)
async def handle_auth_error(request: Request, exc: AuthError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": str(exc)},
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.exception_handler(ForbiddenError)
async def handle_forbidden(request: Request, exc: ForbiddenError) -> JSONResponse:
    return JSONResponse(status_code=status.HTTP_403_FORBIDDEN, content={"detail": str(exc)})


app.include_router(products_router)
app.include_router(auth_router)
app.include_router(orders_router)
app.include_router(payments_router)


@app.get("/")
async def read_root() -> dict[str, str]:
    return {"message": "Welcome to Petone API"}


@app.get("/health")
async def health(db: DbSession) -> dict[str, str]:
    """Liveness check that also confirms the database is reachable."""
    try:
        await db.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable",
        ) from exc
    return {"status": "ok"}
