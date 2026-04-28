import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models import Cert
from app.routers.admin._helpers import ReorderPayload, apply_reorder
from app.schemas.cert import CertCreate, CertRead, CertUpdate

router = APIRouter(prefix="/certs", tags=["admin/certs"])


@router.get("", response_model=list[CertRead])
async def list_certs(session: Annotated[AsyncSession, Depends(get_session)]) -> list[Cert]:
    result = await session.execute(select(Cert).order_by(Cert.sort_order))
    return list(result.scalars().all())


@router.post("", response_model=CertRead, status_code=status.HTTP_201_CREATED)
async def create_cert(
    payload: CertCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Cert:
    row = Cert(**payload.model_dump())
    session.add(row)
    await session.commit()
    await session.refresh(row)
    return row


@router.patch("/{cert_id}", response_model=CertRead)
async def update_cert(
    cert_id: uuid.UUID,
    payload: CertUpdate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Cert:
    row = await session.get(Cert, cert_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(row, k, v)
    await session.commit()
    await session.refresh(row)
    return row


@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cert(
    cert_id: uuid.UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    row = await session.get(Cert, cert_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="not found")
    await session.delete(row)
    await session.commit()


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_certs(
    payload: ReorderPayload,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    await apply_reorder(session, Cert, payload.items)
