.PHONY: all

run-dev: backend-dev
	echo "Backend development server is running on http://localhost:8000"

backend-dev:
	@cd backend && uvicorn main:app --reload --port 8000