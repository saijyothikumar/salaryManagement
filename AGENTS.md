# AGENTS.md

## Project context
- Product: employee salary management software for an organization.
- Primary user: HR Manager.
- Stack: FastAPI + Python 3.11/3.12 + SQLite for the backend; Next.js + React + TypeScript + Tailwind for the frontend.

## Required structure
Keep the repository aligned with this top-level layout:

salary-management/
├── AGENTS.md
├── README.md
├── requirements.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── api/
│   │   ├── services/
│   │   └── tests/
│   ├── scripts/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── ...
└── docs/

## Hard rules
1. Do not create files outside the required structure.
2. Do not create one file per tiny endpoint or random utility file.
3. Keep files small and focused.
4. Use clear, consistent names.
5. Put all database connection logic only in backend/app/core/database.py.
6. The SQLite database file must live at backend/salary_management.db.
7. The backend must expose GET /health returning {"status": "ok"}.
7. The frontend must show a minimal App Router page with the text “Salary Management – Phase 1 Skeleton”.
8. Do not add authentication, employee models, seed scripts, or charts in Phase 1.
9. Keep dependencies minimal.
10. Prefer simple, working defaults over over-engineering.
11. Before choosing versions, configs, or framework defaults, check the current stable toolchain and package versions in the local environment and prefer modern, compatible defaults over outdated assumptions.
