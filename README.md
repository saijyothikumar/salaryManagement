# 💼 ACME HR — Employee Salary Management Platform

> **Modern, web-based salary intelligence for 10,000+ global employees.**  
> Built for HR Managers to replace complex Excel sheets with instant compensation insights, interactive search, and automated workflows.

---

## ⚡ Live Deployments & Status

[![CI Pipeline Status](https://img.shields.io/badge/CI%20Pipeline-Passing-brightgreen?style=flat-square&logo=githubactions)](file:///.github/workflows/ci.yml)
[![Python Version](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](file:///backend/requirements.txt)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](file:///backend/app/main.py)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](file:///frontend/package.json)
[![SQLite](https://img.shields.io/badge/SQLite-10%2C000%20Seeded-003B57?style=flat-square&logo=sqlite)](file:///backend/salary_management.db)

* 🌐 **Live Web Application (Frontend)**: [Vercel Deployment](https://salary-management-2uyu.vercel.app/)
* ⚙️ **Live REST API & Swagger Docs (Backend)**: [Render API Documentation](https://salary-management-backend.onrender.com/docs)

---

## ✨ Features at a Glance

* 📊 **Executive HR Command Center**: Real-time payroll statistics, active workforce ratios, top department metrics, and country pay bands.
* 🔍 **10k Employee Directory**: 300ms debounced live search, multi-field filter combinations, server-side pagination (<10ms queries), and inline salary editing.
* 📬 **High-Priority Mail Reader & Daily Briefing**: Interactive modal windows for reviewing urgent compensation claims and daily HR briefing summaries.
* 🔄 **Auto-Replenishing Approval Queue**: Automated workflow approvals with mandatory rejection comments and continuous request generation.
* 👥 **HR Specialist Workload Grid**: Visual workload tracking across international HR leads.
* 🔔 **Real-Time Event Simulation**: Background toast notifications and horizontal upcoming events carousel.
* 🔒 **Bcrypt & JWT Security**: Role-based endpoint authorization for protected operations.

---

## 📂 Assessment Artifacts & Engineering Notes

All planning, architectural trade-offs, and assessment artifacts are committed in the repository:

* 📋 [Requirements Document](requirements.md) — Goal, scope, features, and explicit exclusions rationale.
* 🏛️ [Architecture Specification](docs/architecture.md) — System flow, data schemas, API endpoints, and 10k performance strategy.
* ⚖️ [Trade-offs & Performance Analysis](docs/tradeoffs_and_performance.md) — Simple technical trade-offs (SQLite, FastAPI, Server Pagination) and benchmarks.
* 🤖 [AI Methodology & Prompts Log](docs/ai_prompts.md) — Prompt sequence, execution logs, and agentic AI workflow history.

---

## 🚀 Quickstart Guide (Run Locally)

### 1. Clone & Setup Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate | On macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python scripts/seed.py      # Seeds 10,000 employees & default HR admin
uvicorn app.main:app --reload --port 8000
```
*Backend API Docs will be live at `http://127.0.0.1:8000/docs`*

### 2. Setup Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Frontend Application will be live at `http://localhost:3000`*

### 3. Run Test Suites & Verification
```bash
# Backend Pytest Suite (17 tests)
cd backend && pytest

# Frontend Typecheck & Build
cd frontend && npx tsc --noEmit && npm run build
```

---

## 🛠️ Tech Stack

| Layer | Technology | Key Highlight |
|---|---|---|
| **Backend** | Python 3.12 + FastAPI | Async REST API & OpenAPI docs |
| **Database** | SQLModel + SQLite 3 | 10k indexed records in 3.4 MB |
| **Frontend** | Next.js 16 + React 19 + TypeScript | App Router static & client views |
| **Styling** | Vanilla CSS3 | Custom design system & HSL themes |
| **CI/CD** | GitHub Actions | Automated parallel quality gates |
