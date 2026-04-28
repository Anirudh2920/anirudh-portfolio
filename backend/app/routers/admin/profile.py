from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models import AdminUser, Profile
from app.schemas.profile import (
    AboutRead,
    AboutUpdate,
    PasswordUpdate,
    ProfileRead,
    ProfileUpdate,
)
from app.security import get_current_admin, hash_password, verify_password

router = APIRouter(tags=["admin/profile"])


@router.get("/profile", response_model=ProfileRead)
async def read_profile(session: Annotated[AsyncSession, Depends(get_session)]) -> Profile:
    result = await session.execute(select(Profile).where(Profile.id == 1))
    return result.scalar_one()


@router.patch("/profile", response_model=ProfileRead)
async def update_profile(
    payload: ProfileUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Profile:
    profile = (await session.execute(select(Profile).where(Profile.id == 1))).scalar_one()
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(profile, k, v)
    await session.commit()
    await session.refresh(profile)
    return profile


@router.get("/about", response_model=AboutRead)
async def read_about(session: Annotated[AsyncSession, Depends(get_session)]) -> AboutRead:
    profile = (await session.execute(select(Profile).where(Profile.id == 1))).scalar_one()
    return AboutRead(raw=profile.about_markdown)


@router.patch("/about", response_model=AboutRead)
async def update_about(
    payload: AboutUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> AboutRead:
    profile = (await session.execute(select(Profile).where(Profile.id == 1))).scalar_one()
    profile.about_markdown = payload.raw
    await session.commit()
    return AboutRead(raw=profile.about_markdown)


@router.patch("/profile/password")
async def update_password(
    payload: PasswordUpdate,
    user: Annotated[AdminUser, Depends(get_current_admin)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> dict[str, bool]:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="wrong current password")
    user.password_hash = hash_password(payload.new_password)
    await session.commit()
    return {"ok": True}
