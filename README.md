# Hash

Factory-grade cleaning materials website (detergents, sanitizers, industrial
degreasers, soaps). Bilingual Arabic (RTL) / English (LTR), with a reactive
"Wojak" Rive character and rule-based chatbot.

## Monorepo layout

```
backend/     FastAPI + asyncpg + raw SQL (no ORM), minimal DDD
frontend/    React + TypeScript + Vite + Redux Toolkit + Tailwind
database/    PostgreSQL migrations, seeds, reflected master DDL
docs/        Wojak integration guide + future work
```

## Quick start

1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```

2. Provision the database (migrate + seed + reflect):
   ```bash
   cd database/db
   make migrate seed reflect
   ```

3. Run the backend:
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -e .
   cp .env.example .env
   uvicorn main:app --reload
   ```

4. Run the frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

API base: `http://localhost:8000/api/v1` · UI: `http://localhost:5173`

## Documentation

- `docs/WOJAK_INTEGRATION.md` — how events drive the Wojak character and chat.
- `docs/FUTURE_WORK.md` — every stub, TODO, and deferred feature.
- `database/db/schema.ddl.sql` — reflected full schema.
