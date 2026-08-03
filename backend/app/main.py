import logging
import time
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.analytics import router as analytics_router
from app.api.v1.auth import router as auth_router
from app.api.v1.employees import router as employees_router
from app.core.database import initialize_database

# Configure root application logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d) - %(message)s",
)
logger = logging.getLogger("salary_management")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing salary management application database...")
    initialize_database()
    yield
    logger.info("Shutting down salary management application...")


app = FastAPI(
    title="ACME Employee Salary Management API",
    version="0.2.0",
    description="High-performance salary management and reporting software for organization with 10,000+ employees.",
    lifespan=lifespan,
)

# CORS middleware for local frontend development and production web clients (Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from local dev and Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    logger.info(
        f"{request.method} {request.url.path} -> Status {response.status_code} ({duration_ms}ms)"
    )
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception processing {request.method} {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please contact system administrator."},
    )


# Versioned API Routers
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(employees_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(auth_router)

app.include_router(api_v1_router)
# Backward-compatibility router mounting for root /employees
app.include_router(employees_router)


@app.get("/", tags=["Root"])
def root() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "ACME Employee Salary Management API",
        "version": "0.2.0",
        "health_check": "/health",
        "interactive_docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok", "system": "ACME Salary Management API v0.2.0"}