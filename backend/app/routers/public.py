from typing import Annotated

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.schemas.portfolio import PortfolioResponse
from app.services.portfolio import build_portfolio

router = APIRouter(tags=["public"])


@router.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/portfolio", response_model=PortfolioResponse)
async def get_portfolio(
    response: Response,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> PortfolioResponse:
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=600"
    return await build_portfolio(session)
