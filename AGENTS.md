# AGENTS.md

## Project Context
- **Product**: Web-based employee salary management software for an organization with 10,000+ employees.
- **Primary User**: HR Manager.
- **Backend Stack**: FastAPI + Python 3.12 + SQLModel + SQLite.
- **Frontend Stack**: Next.js (App Router) + React + TypeScript + Vanilla CSS.

## Required Structure
Keep the repository strictly aligned with this top-level layout:

```text
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
│   │   │   └── v1/
│   │   ├── services/
│   │   └── tests/
│   ├── scripts/
│   │   └── seed.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── docs/
```

## Hard Rules
1. **Directory Structure**: Do not create files outside the required structure.
2. **File Granularity**: Do not create one file per tiny endpoint or random utility file. Keep files focused and maintainable.
3. **Concise Code**: Keep files small, clean, and well-structured.
4. **Naming Standards**: Use clear, consistent camelCase for TypeScript/React and snake_case for Python modules.
5. **Database Path**: The SQLite database file must live at `backend/salary_management.db`.
6. **Minimal Dependencies**: Keep external dependencies minimal. Avoid bloated libraries when standard toolchains suffice.
7. **No Over-Engineering**: Prefer simple, working defaults over excessive abstraction layers or microservices patterns.
8. **Toolchain Compatibility**: Before choosing versions, configs, or framework defaults, check current stable toolchain versions in the local environment and prefer modern, compatible defaults over outdated assumptions.

## Security & API Design Guidelines
9. **API Versioning**: Mount all core application REST endpoints under versioned router prefixes (`/api/v1/...`).
10. **SQL Injection Immunity**: Always use SQLModel / SQLAlchemy parameter binding for queries. Never construct raw SQL strings with string formatting.
11. **Query Input Bounds**: Constrain pagination query parameters (`page >= 1`, `1 <= page_size <= 100`) and search string lengths (`max_length=50`) to prevent Denial of Service.
12. **Structured Logging**: Use `logging.getLogger("salary_management")` with standard request telemetry middleware and global 500 exception handlers. Never swallow exceptions silently.
13. **Testing Standard**: Maintain high test coverage with fast, deterministic Pytest unit and integration tests under `backend/app/tests/`.
14. **Incremental Code Snippets**: When changes are requested, state what to change, where to change, and provide clean code snippets instead of re-generating whole files unnecessarily.