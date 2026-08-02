# Project Requirements & Phase Checkpoints

## Goal & Scope
Build an enterprise-grade, web-based Employee Salary Management system for an organization with **10,000+ employees** across multiple international locations. The software empowers the **HR Manager** to replace tedious Excel spreadsheets with an interactive dashboard to monitor compensation, search and filter workforce records, analyze regional pay bands, and answer organizational payroll questions instantly.

---

## Technical Stack & Core Dependencies

### Backend Stack
* **Language & Runtime**: Python 3.12+
* **Web Framework**: FastAPI `v0.115.0`
* **ORM & Data Layer**: SQLModel `v0.0.39` (built on SQLAlchemy & Pydantic)
* **Database Engine**: SQLite 3 (`backend/salary_management.db`)
* **ASGI Server**: Uvicorn `v0.32.0`
* **Test Suite**: Pytest `v9.1.1` & HTTPX `v0.28.1`

### Frontend Stack
* **Framework**: Next.js `v16.2.12` (App Router)
* **UI Library**: React `v19.2.8`
* **Language**: TypeScript `v5.9.3`
* **Styling**: Vanilla CSS3 (Custom Design System with Inter & JetBrains Mono typography)

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
* **Test Suite & Build Verification**:
  * Created Pytest suite in `backend/app/tests/` verifying pagination logic, filter combinations, sorting, analytics, and API status codes (**8 passed in 0.80s**).
  * Validated Next.js production build with TypeScript type-checking (**✓ Compiled successfully**).

---

## Deliberately Excluded / Future Scope
* **Authentication & Role-Based Access Control (RBAC)**: Excluded in early phases to focus on core data management; planned for future production security hardening.
* **Complex Payroll Calculations**: Tax deductions, bonus structures, and overtime calculations are kept out of scope for initial salary directory tracking.
