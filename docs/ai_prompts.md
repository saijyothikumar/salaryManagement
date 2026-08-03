# AI Development Methodology & Prompt Log

This document records the agentic AI tool interactions, prompt engineering patterns, and step-by-step instructions used throughout the development lifecycle of the ACME HR Employee Salary Management Platform.

---

## 1. Agentic AI Strategy & Workflow Principles

The project was developed using a paired agentic approach guided by strict project rules defined in `AGENTS.md`:

1. **Incremental Phase-by-Phase Development**: Each feature (Backend Skeleton → 10k Seeding → Multi-page UI → Auth → HR Command Center → CI/CD) was implemented incrementally with build verification after every step.
2. **Context-Aware Rule Enforcement**: Custom rules enforced parameter binding for SQL queries, strict paginated API bounds, structured logging, minimal dependencies, and clear naming standards (`snake_case` in Python, `camelCase` in TypeScript).
3. **Automated Quality Verification**: Every code modification was verified by executing Pytest suites, TypeScript type checks, and Next.js production builds.

---

## 2. Prompts Log & Execution History

### Phase 1: Architecture & Project Skeleton Setup
> **Goal**: Establish repository layout, FastAPI backend skeleton, SQLModel database initialization, and Next.js frontend structure.
>
> **Prompt Instruction**:
> *"Initialize a clean full-stack application for salary management following AGENTS.md rules. Create `backend/` with FastAPI 0.115, SQLModel, SQLite database path at `backend/salary_management.db`, and `frontend/` with Next.js 16 App Router and Vanilla CSS."*

---

### Phase 2: 10,000-Record Bulk Seeding & Paginated API
> **Goal**: Generate realistic multi-country workforce data and implement high-performance paginated REST endpoints.
>
> **Prompt Instruction**:
> *"Create a seeding script `backend/scripts/seed.py` that generates 10,000 realistic employees across 6 countries (US, UK, IN, DE, JP, CA) and 8 departments using transaction batching. Implement `/api/v1/employees` endpoint supporting `page`, `page_size`, 300ms debounced search, multi-field filter selects, and database composite indexing."*

---

### Phase 3: JWT Security & Multi-Page Navigation
> **Goal**: Implement authentication and multi-page routing layout.
>
> **Prompt Instruction**:
> *"Integrate Bcrypt password hashing and PyJWT token authorization in FastAPI. Create `/api/v1/auth/login` and protect PUT endpoints. Build a Next.js App Router layout with a persistent Header, Landing Page (`/`), Directory Page (`/directory`), and Support Page (`/support`)."*

---

### Phase 4: HR Command Center, Interactive Modals & Timed Alerts
> **Goal**: Enhance the HR Manager dashboard experience with executive command center tools.
>
> **Prompt Instruction**:
> *"Build an executive HR Command Center homepage featuring a Daily Briefing modal, high-priority email reader modal, an auto-replenishing approval queue requiring mandatory rejection comments, team specialist workload cards, background real-time toast alert timers, and an upcoming events carousel."*

---

### Phase 5: CI/CD Pipeline & Documentation Artifacts
> **Goal**: Automate quality checks and compile assessment documentation artifacts.
>
> **Prompt Instruction**:
> *"Create `.github/workflows/ci.yml` running parallel backend pytest and frontend typecheck/build jobs. Compile assessment artifacts in `docs/` (`architecture.md`, `tradeoffs_and_performance.md`, `ai_prompts.md`) and update `README.md` into a creative, clean project homepage."*


