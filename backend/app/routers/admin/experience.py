import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models import Experience
from app.routers.admin._helpers import ReorderPayload, apply_reorder
from app.schemas.experience import ExperienceCreate, ExperienceRead, ExperienceUpdate

router = APIRouter(prefix="/experience", tags=["admin/experience"])


@router.get("", response_model=list[ExperienceRead])
async def list_experiences(session: Annotated[AsyncSession, Depends(get_session)]) -> list[Experience]:
    result = await session.execute(select(Experience).order_by(Experience.sort_order))
    return list(result.scalars().all())


@router.post("", response_model=ExperienceRead, status_code=status.HTTP_201_CREATED)
async def create_experience(
    payload: ExperienceCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Experience:
    row = Experience(**payload.model_dump())
    session.add(row)
    await session.commit()
    await session.refresh(row)
    return row


@router.patch("/{experience_id}", response_model=ExperienceRead)
async def update_experience(
    experience_id: uuid.UUID,
    payload: ExperienceUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Experience:
    row = await session.get(Experience, experience_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    await session.commit()
    await session.refresh(row)
    return row


@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    experience_id: uuid.UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    row = await session.get(Experience, experience_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    await session.delete(row)
    await session.commit()


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_experiences(
    payload: ReorderPayload,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    await apply_reorder(session, Experience, payload.items)
