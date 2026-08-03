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
  * **Support & FAQ Page (`/support`)**: HR FAQs and direct feedback mail link (`mailto:saikumarjyo14@gmail.com`).

---

### Phase 4 & 4.1 Checkpoint: HR Command Center, Interactive Modals & Timed Alert Simulation
* **Header Redesign & Navigation Back Button**:
  * Positioned brand logo at top-left of Header with executive dark teal styling (`#0F4C5C`) and gold accent trim.
  * Added **"Daily Briefing 💡"** header button to trigger the welcome briefing modal anytime.
  * Added persistent **"← Back to Command Center"** navigation button on `/directory` and `/support` subpages.
* **Welcome Daily Briefing Modal (`components/WelcomeBriefingModal.tsx`)**:
  * Interactive modal opening on initial site visit with daily HR summary, close cross icon `✕`, and click-outside backdrop dismissal. Stores dismissed state in `sessionStorage`.
* **High-Priority Mails & Interactive Reader Modal (`components/HighPriorityMails.tsx`)**:
  * Inbox section with priority email cards (*"Urgent: Japan Deposit Delay", "Executive Compensation Review", "Q3 Relocation Claims"*).
  * Clicking an email opens the **Mail Reader Modal** displaying sender info, full message text, attachment actions, and quick response triggers.
* **Auto-Replenishing Approval Queue (`components/ApprovalsQueue.tsx`)**:
  * Seeded 8 initial approval items across onboarding, advances, and reimbursements.
  * Added auto-replenish logic: if pending approvals count drops below 4, the backend service (`workflow_service.py`) automatically generates realistic incoming requests.
  * Enforces **Mandatory Rejection Comment**: Rejecting a request strictly requires a non-empty reason comment on client UI and server API (`400 Bad Request` if blank).
  * Table features horizontal scroll container (`overflow-x: auto`), clean column widths, and **Attachment Column** (`📎 Receipt_1092.pdf`).
* **HR Specialist Team Task Board (`components/TeamTaskBoard.tsx`)**:
  * Visual workload grid tracking tickets assigned across the HR Manager's 6 team specialists (*Sarah Jenkins - Payroll Lead*, *David Ross - UK Specialist*, *Elena Rostova - Benefits Admin*, etc.).
* **Timed Real-Time Event Simulation (`lib/useTimedAlerts.ts` & `components/ToastContainer.tsx`)**:
  * Background timer hook executing live floating toast alerts in bottom-right corner at `15s`, `45s`, `75s (1.2m)`, `180s (3m)`, and `300s (5m)`.
* **Horizontal Events Carousel (`components/EventsCarousel.tsx`)**:
  * Scrollable horizontal carousel (`←` and `→` controls) for upcoming company events, pay dates, and compliance deadlines at the bottom of the home page.
* **Test Suite & Build Verification**:
  * Expanded Pytest suite to 17 tests covering workflow overview, queue auto-replenish, and mandatory rejection comments (**17 passed in 4.76s**).
  * Validated Next.js production build for all 4 routes (**✓ Compiled successfully**).

---

## Deliberately Excluded / Future Scope
* **SMTP Email Notification Service (Mailer Out of Scope)**: Real-time email dispatch is explicitly excluded to maintain zero external network dependencies during offline and free-tier deployment. Approval/rejection statuses are recorded in database audit trails instead.
* **Binary File / Cloud S3 Storage**: File attachment indicators are displayed in UI tables (`Receipt_901.pdf`), while binary cloud S3 hosting is out of scope.
* **Public Sign-Up / Self-Registration**: Excluded intentionally to maintain internal organizational control; HR accounts are seeded by administrators.
