# Hash

Factory-grade cleaning materials website (detergents, sanitizers, industrial
degreasers, soaps). Bilingual Arabic (RTL) / English (LTR), with a reactive
"Wojak" Rive character and rule-based chatbot.

## Monorepo layout

```
backend/     FastAPI + asyncpg + raw SQL (no ORM), minimal DDD
frontend/    React + TypeScript + Vite + Redux Toolkit + Tailwind
database/    PostgreSQL feature-scoped DDL, migrations, seeds
docs/        Wojak integration guide + future work
```

## Quick start

1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```

2. Provision the database:
   ```bash
   cd database/db
   make all seed
   ```
   `make all` builds the schema from the feature-scoped DDL files; `make seed`
   loads reference data. Use `make dropdb` to reset, or `make migrate` to
   apply `schema-migrations/*.sql`.

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
- `database/db/features/<feature>/` — schema organized per domain, each with
  `setup.ddl` (tables), `functions.ddl`, `triggers.ddl`, and `views.ddl`.
