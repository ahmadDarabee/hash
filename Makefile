.PHONY: dev-run dev-stop dev-backend dev-frontend

dev-stop:
	@echo "Stopping backend development server..."
	@pkill -f "uvicorn main:app --reload --port 8000" || true

dev-backend:
	@cd backend && uvicorn main:app --reload --port 8000

dev-frontend:
	@cd frontend && npm run dev

dev-run: dev-stop
	@make -j2 dev-backend dev-frontend