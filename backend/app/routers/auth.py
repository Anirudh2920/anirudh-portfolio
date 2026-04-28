from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_session
from app.models.admin_user import AdminUser
from app.schemas.auth import LoginRequest, MeResponse, TokenResponse
from app.security import (
    create_access_token,
    create_refresh_token,
    get_current_admin,
    get_subject_from_refresh_cookie,
    refresh_cookie_kwargs,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)
_settings = get_settings()


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,  # required by slowapi
    payload: LoginRequest,
    response: Response,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    result = await session.execute(select(AdminUser).where(AdminUser.username == payload.username))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials")

    user.last_login_at = datetime.now(UTC)
    await session.commit()

    access = create_access_token(user.username)
    refresh = create_refresh_token(user.username)
    response.set_cookie(**refresh_cookie_kwargs(refresh))
    return TokenResponse(access_token=access, expires_in=_settings.jwt_access_ttl_seconds)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    response: Response,
    subject: Annotated[str, Depends(get_subject_from_refresh_cookie)],
) -> TokenResponse:
    access = create_access_token(subject)
    new_refresh = create_refresh_token(subject)
    response.set_cookie(**refresh_cookie_kwargs(new_refresh))
    return TokenResponse(access_token=access, expires_in=_settings.jwt_access_ttl_seconds)


@router.post("/logout")
async def logout(response: Response) -> dict[str, bool]:
    response.delete_cookie("refresh_token", path="/api/auth")
    return {"ok": True}


@router.get("/me", response_model=MeResponse)
async def me(user: Annotated[AdminUser, Depends(get_current_admin)]) -> MeResponse:
    return MeResponse(username=user.username)
