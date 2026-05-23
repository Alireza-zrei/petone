# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Petone** is a full-stack pet products store. The repo is a two-project monorepo:

- `backend/` — Python 3.11 / FastAPI / async SQLAlchemy 2.0 / Alembic, served by Uvicorn (dev) or Gunicorn+UvicornWorker (prod). PostgreSQL via asyncpg in production; falls back to SQLite (aiosqlite) when `DATABASE_URL` is unset.
- `frontend/` — React 19 + TypeScript + Vite + Tailwind v4. The storefront is RTL/Persian (Vazirmatn font). Reads its API base URL from `process.env.API_URL`, injected by `vite.config.ts` (`API_URL` env var, defaults to `http://localhost:8000`).

There is no shared `package.json` at the repo root — install/run commands are always scoped to one of the two subprojects.

## Common commands

### Backend (run from `backend/`)

```bash
# One-time setup
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt   # includes test + ruff
cp .env.example .env                  # then edit SECRET_KEY etc.

# Dev server (auto-reload, SQLite by default)
uvicorn app.main:app --reload --port 8000

# Migrations (alembic.ini reads URL from app.config.settings via alembic/env.py)
alembic upgrade head
alembic revision --autogenerate -m "describe change"

# Seed the demo catalogue (idempotent; skipped if products exist)
python -m app.seed

# Tests — uses an in-memory SQLite per test via tests/conftest.py
pytest                                # all tests
pytest tests/test_orders.py           # one file
pytest tests/test_orders.py::test_name # one test
pytest -k "checkout"                  # by keyword

# Lint / format
ruff check .
ruff check . --fix
ruff format .
```

### Frontend (run from `frontend/`)

```bash
npm install
npm run dev      # Vite on port 3000, host 0.0.0.0
npm run build    # production build into dist/
npm run lint     # tsc --noEmit (type-check only; there is no ESLint configured)
```

There is no frontend test runner. `npm run lint` is the only pre-commit check.

### Full stack via Docker Compose (from `backend/`)

```bash
docker compose up --build   # spins up postgres + migrate + backend + frontend
```

The `frontend` service mounts `../frontend` into a `node:20-alpine` container and runs `npm install && npm run dev` inside it.

## Architecture

### Backend — domain-driven layout

Code under `backend/app/` is organized by domain rather than by layer. Each domain in `app/domains/<name>/` follows the same file layout:

- `models.py` — SQLAlchemy 2.0 ORM models (`Mapped[...]` style, declared on `app.database.Base`).
- `schemas.py` — Pydantic v2 request/response models.
- `crud.py` — Pure DB operations against an `AsyncSession`. No business rules, no HTTP concerns.
- `service.py` — Business logic. Raises domain exceptions (see below). Calls `crud` and other domains' services.
- `router.py` — FastAPI router. Thin: validates input, calls service, returns models/schemas.

Domains: `products`, `users` (auth lives here — `/auth/*` routes), `orders` (also owns `/cart/*`), `payments`.

Cross-domain calls go service → service (e.g. `orders.service` imports `products.service`; `payments.service` imports `orders.service`). Routers never call other routers; CRUD never calls services.

### Error handling

All app errors inherit from `PetoneError` in `app/exceptions.py`, organized in two layers:

1. Generic HTTP-mapped bases: `NotFoundError` (404), `ConflictError` (409), `AuthError` (401), `ForbiddenError` (403).
2. Domain-specific subclasses (e.g. `ProductNotFound`, `InsufficientStock`, `OrderNotPayable`) that carry structured context.

`app/main.py` registers one handler per generic base — services raise the specific subclass, the response shape is uniform across domains. When adding new error cases, prefer subclassing an existing mid-tier class over registering a new handler.

### Auth & dependencies

- JWTs via `python-jose` with HS256, two token types (`access`, `refresh`) distinguished by a `type` claim in `app/security.py`. Passwords hashed with bcrypt via passlib.
- `app/dependencies.py` exposes the typed dependencies the routers consume:
  - `DbSession = Annotated[AsyncSession, Depends(get_db)]`
  - `CurrentUser = Annotated[User, Depends(get_current_user)]` — decodes the bearer access token, loads the user.
  - `get_current_admin` — used as a `dependencies=[Depends(...)]` guard on admin-only product endpoints.

### Database & migrations

- One declarative `Base` in `app/database.py` shared by all domain models.
- `alembic/env.py` imports every domain's `models` module so `Base.metadata` is fully populated before autogenerate runs. **When adding a new domain, add an `import ... noqa: F401` line in `env.py` or autogenerate will silently miss the new tables.**
- All sessions are `AsyncSession`; relationships that are walked at request time (e.g. `Cart.items`, `Order.items`, `CartItem.product`) use `lazy="selectin"` to avoid `MissingGreenlet` errors.

### Payment gateway abstraction

`app/domains/payments/gateway.py` defines a `PaymentGateway` Protocol with two adapters: `FakePaymentGateway` (default, used in dev/tests — the payment URL it returns points straight back at the callback so the redirect round-trip is testable end-to-end) and `ShaparakGateway` (stub, raises `NotImplementedError`). Selection is driven by `settings.payment_gateway`. When implementing Shaparak, use `httpx.AsyncClient` and add `httpx` to `requirements.txt`.

### Observability

`app/observability.py` provides a pure-ASGI `RequestIdMiddleware` that assigns each request a UUID (honoring incoming `X-Request-ID`), stores it in a `ContextVar`, echoes it in the response header, and embeds it in the JSON log formatter. `configure_logging()` is called at import time in `main.py` and replaces uvicorn's loggers so every line — app and server — is single-line JSON with `request_id`.

### Rate limiting

`slowapi` limiter lives in its own `app/rate_limit.py` module to break the import cycle between `main.py` (wiring) and `auth/router.py` (`@limiter.limit` decorators). The autouse fixture `_disable_rate_limiter` in `tests/conftest.py` turns the limiter off for every test — `test_rate_limit.py` re-enables it explicitly.

### Tests

`tests/conftest.py` builds an in-memory SQLite engine (`sqlite+aiosqlite://` with `StaticPool`) per test, creates the schema via `Base.metadata.create_all` (so migrations are NOT exercised by the unit tests), and overrides `get_db` on the app. `client`, `admin_headers`, and `user_headers` fixtures cover the typical setup.

### Frontend

- The entire UI is a single `src/App.tsx` (~5.7k lines). `src/constants.ts` holds the static catalog/category fallback data. `src/api.ts` is the only place that talks to the backend — `fetchProducts()` maps the backend snake_case `ApiProduct` to the frontend camelCase `Product`. When backend product fields change, update `ApiProduct` and `mapProduct` together.
- Tailwind v4 is configured via the Vite plugin (`@tailwindcss/vite`) and `@theme` blocks in `src/index.css` — there is no `tailwind.config.js`. Brand tokens (`brand-orange*`) and the Vazirmatn font are declared there.
- RTL is enforced globally via `html { direction: rtl }` in `index.css`.
- Path alias `@/*` resolves to the `frontend/` root (see `tsconfig.json` and `vite.config.ts`).

## CI

`.github/workflows/python-app.yml` — on backend changes, runs `python -m compileall` and an import smoke test of `app.main`. It does **not** run pytest.

`.github/workflows/node.yml` — on frontend changes, runs `npm ci && npm run build`. It does not run `npm run lint`.

If you add real test execution to CI, mirror the path filters that already scope each workflow to its subproject.
