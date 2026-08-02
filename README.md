# Salary Management

This repository contains a Phase 1 skeleton for a salary management web application.

## What is included
- A minimal FastAPI backend with a health endpoint.
- A minimal Next.js App Router frontend page.
- A simple project structure that can be expanded later.

## Local development

### Backend
From the project root:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Frontend
From the project root:

```powershell
cd frontend
npm install
npm run dev
```

The backend health endpoint should respond at http://127.0.0.1:8000/health and the frontend should be available at http://127.0.0.1:3000.
