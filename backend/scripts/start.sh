#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Auto-seed database if salary_management.db does not exist on instance boot
if [ ! -f "salary_management.db" ]; then
    echo "[Boot] Database file not found. Seeding 10,000 employees and HR admin user..."
    python scripts/seed.py
fi

echo "[Boot] Launching Uvicorn ASGI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
