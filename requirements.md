# Project Requirements & Phase Checkpoints

## Goal & Scope
Build an enterprise-grade, web-based Employee Salary Management system for an organization with **10,000+ employees** across multiple international locations. The software empowers the **HR Manager** to replace tedious Excel spreadsheets with an interactive dashboard to monitor compensation, search and filter workforce records, analyze regional pay bands, and answer organizational payroll questions instantly.

---

## Technical Stack & Core Dependencies

### Backend Stack
* **Language & Runtime**: Python 3.12+
* **Web Framework**: FastAPI `v0.115.0`
* **ORM & Data Layer**: SQLModel `v0.0.39` (built on SQLAlchemy & Pydantic)
* **Authentication & Cryptography**: Native `bcrypt` `v5.0.0` & PyJWT `v2.13.0`
* **Database Engine**: SQLite 3 (`backend/salary_management.db`)
* **ASGI Server**: Uvicorn `v0.32.0`
* **Test Suite**: Pytest `v9.1.1` & HTTPX `v0.28.1`

### Frontend Stack
* **Framework**: Next.js `v16.2.12` (App Router)
* **UI Library**: React `v19.2.8`
* **Language**: TypeScript `v5.9.3`
* **Styling**: Vanilla CSS3 (Warm Off-White Design System with Inter & JetBrains Mono typography)

---

## Phase Checkpoints & Implementation History

### Phase 1 Checkpoint: Foundation & Architecture Skeleton
* **Backend Skeleton**: Initialized FastAPI backend application with modular folder structure (`app/core`, `app/models`, `app/schemas`, `app/services`, `app/api`).
* **Database Schema**: Created `Employee` SQLModel schema and initialized SQLite database file at `backend/salary_management.db`.
* **Health & Base Endpoints**: Created `GET /health` sanity check endpoint and initial `/employees` list endpoint to verify database ORM queries.
* **CORS Middleware**: Configured `CORSMiddleware` in FastAPI to allow cross-origin requests from `http://localhost:3000` and `http://127.0.0.1:3000`.
* **Deployment Configs**: Added deployment configuration files:
  * `render.yaml` for FastAPI web service deployment on Render.
  * `vercel.json` for Next.js frontend deployment on Vercel.

---

### Phase 2 Checkpoint: Data Scaling, Backend API, & HR Dashboard UI
* **10,000-Record Bulk Seeding**:
  * Developed `backend/scripts/seed.py` generating 10,000 realistic multi-country employee records across 6 countries (US, UK, IN, DE, JP, CA) and 8 departments.
  * Optimized SQLite insertion using transaction batching (1,000 records/commit), achieving a benchmark seeding execution time of **1.86 seconds**.
* **Database Query Indexing**:
  * Added single-column indexes on high-cardinality filter fields (`department`, `country`, `status`, `base_salary`).
  * Created composite index `idx_dept_country_status` on `(department, country, status)` ensuring sub-10ms query performance over 10,000 rows.
* **Versioned REST API (`/api/v1`)**:
  * `GET /api/v1/employees`: Implemented server-side offset/limit pagination (`page`, `page_size`), case-insensitive search (`first_name`, `last_name`, `email`, `employee_code`), filter parameters (`department`, `country`, `status`), and safe column sort whitelisting (`sort_by`, `sort_order`).
  * `GET /api/v1/analytics`: Built instant SQL aggregation service using `func.sum()`, `func.avg()`, and `func.count()` grouped by department and country to calculate organizational payroll statistics.
* **Interactive HR Dashboard UI**:
  * `SalaryStats`: Executive metric cards displaying total headcount (10,000), active workforce percentage, top-paying department, and top-paying region.
  * `EmployeeFilterBar`: Multi-filter toolbar featuring 300ms debounced live search, department selector, country selector, status filter, and reset button.
  * `EmployeeTable`: Interactive data table supporting column sort indicators (`↑`, `↓`), status badges (`Active`, `On Leave`, `Terminated`), and local currency formatting (`USD`, `GBP`, `INR`, `EUR`, `JPY`, `CAD`).
  * `Pagination`: Page navigation bar with record count indicators (`Showing 1 to 20 of 10,000`) and items-per-page selector (10, 25, 50, 100).
* **Loading State & Media Integration**:
  * Configured `EmployeeTable` to render custom GIF animations located at `frontend/public/loader.gif` with automatic fallback to an animated CSS spinner.
* **Structured Logging & Exception Telemetry**:
  * Standardized backend logging format using Python `logging`.
  * Added `log_requests` HTTP middleware logging method, URL path, response status, and execution duration in milliseconds.
  * Implemented global `@app.exception_handler(Exception)` to log full stack traces while returning clean HTTP 500 JSON error details.
  * Added connection error handling in `frontend/lib/api.ts` for offline server detection.

---

### Phase 3 Checkpoint: Multi-Page Architecture, JWT Auth & Design System
* **Bcrypt Password Hashing & JWT Security**:
  * Integrated native `bcrypt` cryptographic password hashing and `pyjwt` signed token generation in `backend/app/core/security.py`.
  * Created `User` schema and default HR Manager account (`hr_admin`) in seed script with salted Bcrypt password hash.
  * Implemented `POST /api/v1/auth/login` and `GET /api/v1/auth/me`.
  * Protected `PUT /api/v1/employees/{id}` requiring valid HR Manager Bearer token (`Depends(get_current_hr_user)`). Unauthenticated mutations strictly yield `401 Unauthorized`.
* **Multi-Page Next.js App Router Structure**:
  * **Global Header Navigation (`components/Header.tsx`)**: Persistent brand logo, navigation links (**Home** `/`, **Directory** `/directory`, **Support & FAQ** `/support`), user role badge (`Guest Mode` vs `HR Manager`), and **Login/Logout** triggers.
  * **Landing Page (`/`)**: Executive overview landing page featuring high-level salary metrics, platform highlights, and CTA buttons.
  * **Employee Directory Page (`/directory`)**: Full interactive salary directory with search, filters, pagination, and HR inline editing.
  * **Support & FAQ Page (`/support`)**: HR FAQs and direct feedback mail link (`mailto:saikumar@acme.org`).
* **HR Salary Edit Modal (`components/EditEmployeeModal.tsx`)**:
  * Modal drawer allowing authenticated HR Managers to update base salary, job title, department, or status with real-time backend synchronization.
* **Warm Off-White Corporate Design System (`globals.css`)**:
  * Standardized global CSS tokens:
    * Background: `#F7F6F3` (Warm off-white)
    * Cards: `#FFFFFF`
    * Primary: `#0F4C5C` (Deep teal)
    * Accent: `#1D8A7A` (Emerald)
    * Text: `#1A1A1A` / `#5C5C5C`
    * Border: `#E5E2DC`
    * Warning: `#E9C46A`
    * Danger: `#E76F51`
* **Test Suite & Build Verification**:
  * Expanded Pytest suite to 11 tests covering JWT login, password validation, unauthorized mutation blocks, and authorized HR updates (**11 passed in 2.54s**).
  * Compiled Next.js production build for all 4 routes (**✓ Compiled successfully**).

---

## Deliberately Excluded / Future Scope
* **Public Sign-Up / Self-Registration**: Excluded intentionally to maintain internal organizational control; HR accounts are seeded by administrators.
* **Complex Payroll Tax Calculations**: Tax deductions, bonus structures, and overtime calculations are kept out of scope for initial salary directory tracking.
