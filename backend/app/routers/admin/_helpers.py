import uuid
from collections.abc import Sequence

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base


class ReorderEntry(BaseModel):
    id: uuid.UUID
    sort_order: int


class ReorderPayload(BaseModel):
    items: list[ReorderEntry]


async def apply_reorder(
    session: AsyncSession,
    model: type[Base],
    payload: Sequence[ReorderEntry],
) -> None:
    """Apply sort_order changes inside a single locked transaction."""
    if not payload:
        return
    ids = [e.id for e in payload]
    rows = (
        await session.execute(
            select(model).where(model.id.in_(ids)).with_for_update()  # type: ignore[attr-defined]
        )
    ).scalars().all()
    by_id = {r.id: r for r in rows}  # type: ignore[attr-defined]
    for entry in payload:
        row = by_id.get(entry.id)
        if row is not None:
            row.sort_order = entry.sort_order  # type: ignore[attr-defined]
    await session.commit()
