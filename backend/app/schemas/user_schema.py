from sqlmodel import SQLModel


class UserRead(SQLModel):
    id: int
    username: str
    email: str
    role: str


class LoginRequest(SQLModel):
    username: str
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
