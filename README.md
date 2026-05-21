# Petone

**Petone** is a pet products and accessory store — a web app for browsing and
buying everything your pet needs: food, toys, grooming supplies, beds, collars,
leashes, and more.

The project is a full-stack application:

- **Frontend** — React 19 + TypeScript + Vite, styled with Tailwind CSS.
- **Backend** — Python with FastAPI, served by Uvicorn.

## Project structure

```
petone/
├── frontend/   React + TypeScript + Vite storefront
└── backend/    Python FastAPI service (Petone API)
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## Run Locally

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API is then available at `http://localhost:8000`
(`/` welcome message, `/health` health check, `/docs` for interactive docs).

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The storefront runs at `http://localhost:3000`.

## License

See [LICENSE](LICENSE).
