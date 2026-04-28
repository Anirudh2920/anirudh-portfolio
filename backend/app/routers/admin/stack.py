import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db import get_session
from app.models import StackGroup, StackItem
from app.routers.admin._helpers import ReorderPayload, apply_reorder
from app.schemas.stack import (
    StackGroupCreate,
    StackGroupRead,
    StackGroupUpdate,
    StackItemCreate,
    StackItemRead,
    StackItemUpdate,
)

router = APIRouter(prefix="/stack", tags=["admin/stack"])


@router.get("/groups", response_model=list[StackGroupRead])
async def list_groups(session: Annotated[AsyncSession, Depends(get_session)]) -> list[StackGroup]:
    result = await session.execute(
        select(StackGroup)
        .options(selectinload(StackGroup.items))
        .order_by(StackGroup.sort_order)
    )
    return list(result.scalars().all())


@router.post("/groups", response_model=StackGroupRead, status_code=status.HTTP_201_CREATED)
async def create_group(
    payload: StackGroupCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StackGroup:
    row = StackGroup(**payload.model_dump())
    session.add(row)
    await session.commit()
    # selectinload won't fire on refresh; load manually so response is consistent
    await session.refresh(row, attribute_names=["items"])
    return row


@router.patch("/groups/{group_id}", response_model=StackGroupRead)
async def update_group(
    group_id: uuid.UUID,
    payload: StackGroupUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StackGroup:
    row = await session.get(StackGroup, group_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    await session.commit()
    await session.refresh(row, attribute_names=["items"])
    return row


@router.delete("/groups/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(
    group_id: uuid.UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    row = await session.get(StackGroup, group_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    await session.delete(row)
    await session.commit()


@router.post("/groups/{group_id}/items", response_model=StackItemRead, status_code=status.HTTP_201_CREATED)
async def create_item(
    group_id: uuid.UUID,
    payload: StackItemCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StackItem:
    group = await session.get(StackGroup, group_id)
    if group is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="group not found")
    row = StackItem(group_id=group_id, **payload.model_dump())
    session.add(row)
    await session.commit()
    await session.refresh(row)
    return row


@router.patch("/items/{item_id}", response_model=StackItemRead)
async def update_item(
    item_id: uuid.UUID,
    payload: StackItemUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> StackItem:
    row = await session.get(StackItem, item_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    await session.commit()
    await session.refresh(row)
    return row


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: uuid.UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    row = await session.get(StackItem, item_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    await session.delete(row)
    await session.commit()


@router.post("/groups/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_groups(
    payload: ReorderPayload,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    await apply_reorder(session, StackGroup, payload.items)


@router.post("/items/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_items(
    payload: ReorderPayload,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    await apply_reorder(session, StackItem, payload.items)
