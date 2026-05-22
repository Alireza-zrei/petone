from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.domains.products.router import router as products_router
from app.domains.users.router import router as auth_router
from app.exceptions import AuthError, ConflictError, ForbiddenError, NotFoundError

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/")
async def read_root() -> dict[str, str]:
    return {"message": "Welcome to Petone API"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
