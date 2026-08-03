from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import create_access_token, decode_access_token, verify_password
from app.models.user import User
from app.schemas.user_schema import LoginRequest, TokenResponse, UserRead

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)


def get_current_hr_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    session: Session = Depends(get_session),
) -> User:
    """Dependency to validate JWT access token and return HR Manager user."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
        )

    username = payload["sub"]
    user = session.exec(select(User).where(User.username == username)).first()
    if not user or user.role != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. HR Manager access required.",
        )

    return user


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    """Authenticate HR Manager credentials and return JWT bearer token."""
    user = session.exec(select(User).where(User.username == request.username)).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    user_read = UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
    )

    return TokenResponse(access_token=access_token, token_type="bearer", user=user_read)


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_hr_user)):
    """Return current authenticated user profile."""
    return UserRead(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        role=current_user.role,
    )
