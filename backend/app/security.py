from datetime import UTC, datetime, timedelta
from typing import Annotated, Any

from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_session
from app.models.admin_user import AdminUser

_settings = get_settings()
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def hash_password(password: str) -> str:
    # bcrypt has a 72-byte hard limit; pre-validate at the schema layer.
    return _pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _pwd_context.verify(password, password_hash)


def _create_token(subject: str, ttl_seconds: int, token_type: str) -> str:
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + timedelta(seconds=ttl_seconds),
    }
    return jwt.encode(payload, _settings.jwt_secret, algorithm=_settings.jwt_algorithm)


def create_access_token(subject: str) -> str:
    return _create_token(subject, _settings.jwt_access_ttl_seconds, ACCESS_TOKEN_TYPE)


def create_refresh_token(subject: str) -> str:
    return _create_token(subject, _settings.jwt_refresh_ttl_seconds, REFRESH_TOKEN_TYPE)


def decode_token(token: str, expected_type: str) -> str:
    try:
        payload = jwt.decode(token, _settings.jwt_secret, algorithms=[_settings.jwt_algorithm])
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token"
        ) from e

    if payload.get("type") != expected_type:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="wrong token type")

    sub = payload.get("sub")
    if not isinstance(sub, str):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid token claims")
    return sub


async def get_current_admin(
    token: Annotated[str | None, Depends(_oauth2_scheme)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> AdminUser:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username = decode_token(token, ACCESS_TOKEN_TYPE)
    result = await session.execute(select(AdminUser).where(AdminUser.username == username))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user not found")
    return user


async def get_subject_from_refresh_cookie(
    refresh_token: Annotated[str | None, Cookie()] = None,
) -> str:
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing refresh")
    return decode_token(refresh_token, REFRESH_TOKEN_TYPE)


def refresh_cookie_kwargs(token: str) -> dict[str, Any]:
    return {
        "key": "refresh_token",
        "value": token,
        "max_age": _settings.jwt_refresh_ttl_seconds,
        "httponly": True,
        "secure": _settings.is_production,
        "samesite": "lax",
        "path": "/api/auth",
    }
