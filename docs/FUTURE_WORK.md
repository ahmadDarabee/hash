# Future work, stubs, and deferred features

Everything below is intentionally deferred. Clean interfaces/stubs already
exist so each can be added without restructuring.

## Backend stubs (raise `NotImplementedError`, wired via DI)

- `PaymentProvider` — `backend/application/ports/payment.py`
  - No-op impl: `backend/infrastructure/adapters/noop_payment.py`
  - Methods: `charge`, `refund`, `handle_webhook`
- `OrderTrackingProvider` — `backend/application/ports/tracking.py`
  - No-op impl: `backend/infrastructure/adapters/noop_tracking.py`
  - Methods: `get_status`, `list_events`
- `NotificationProvider` — `backend/application/ports/notification.py`
  - No-op impl: `backend/infrastructure/adapters/noop_notification.py`
  - Methods: `send_email`, `send_sms`, `send_whatsapp`

To enable one: write a real implementation, then swap the provider in
`api/deps.py` (`get_payment_provider`, `get_tracking_provider`,
`get_notification_provider`).

## Deferred features

- **Payments** — no payment gateway, no checkout. `Order`/`OrderItem` tables
  exist but no order endpoints or flow.
- **Order management** — no order create/list/cancel endpoints or UI.
- **Order tracking** — stub only.
- **Notifications** — stub only (email/SMS/WhatsApp).
- **Cart persistence** — cart is in-memory Redux only; no backend cart API.
- **Inventory UI** — schema (`inventory_items`, `inventory_movements`),
  repository (`InventoryRepository`), and use cases (`GetInventory`,
  `RecordInventoryMovement`) exist. No admin routes/UI yet. Add routes under
  `/admin/inventory` and a page in `src/pages/admin/`.
- **Full admin** — roles management, reports, inventory UI, order management,
  price-list management UI. Current admin covers products (list/create/edit),
  SDS upload, user list, and per-customer price-list assignment.
- **Wojak LLM adapter** — backend is rule-based intents. Swap
  `WojakChatService` (backend) and the frontend `WojakChatService` interface.
- **Rive asset** — replace the placeholder with a real
  `frontend/public/rive/wojak.riv` (see `frontend/public/rive/README.md`).

## Testing (not implemented)

- Backend: add pytest + httpx `AsyncClient` tests for use cases and routes.
- Frontend: add Vitest + React Testing Library.
- Existing files are intentionally test-free; no CI gate exists yet.

## CI/CD, hosting, deployment (not implemented)

- No CI pipeline, Docker build, or deployment config.
- Local dev only: `uvicorn` (backend), `vite` (frontend), `docker-compose`
  PostgreSQL.

## Known simplifications (documented decisions)

- Inventory `record_movement` reads on-hand quantity then updates it; a
  production version should use row locking/optimistic concurrency in the same
  transaction. See `backend/infrastructure/repositories/inventory_repository.py`.
- File storage is local disk (`LocalDiskStorage`); swap for object storage via
  the `StorageAdapter` port.
- Product search uses `ILIKE` substring matching; consider full-text search.
