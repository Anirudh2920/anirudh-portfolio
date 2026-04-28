import os
from collections.abc import AsyncIterator

# Force test config before app import.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("JWT_SECRET", "test-secret-not-for-production")
os.environ.setdefault("ADMIN_BOOTSTRAP_PASSWORD", "test-pass-1234")

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app import db as db_module
from app.db import get_session
from app.main import app
from app.models import Base
from app.models.admin_user import AdminUser
from app.security import hash_password


@pytest_asyncio.fixture
async def engine():
    eng = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with eng.begin() as conn:
        # SQLite doesn't have JSONB or pg UUID — rely on SQLAlchemy's compatibility
        # paths (JSONB falls back to JSON on SQLite via dialects). For tests we
        # only verify routing, schema validation and auth flow.
        await conn.run_sync(Base.metadata.create_all)
    yield eng
    await eng.dispose()


@pytest_asyncio.fixture
async def session(engine) -> AsyncIterator[AsyncSession]:
    Session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with Session() as s:
        yield s


@pytest_asyncio.fixture
async def client(engine) -> AsyncIterator[AsyncClient]:
    Session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async def _get_session() -> AsyncIterator[AsyncSession]:
        async with Session() as s:
            yield s

    app.dependency_overrides[get_session] = _get_session
    db_module.SessionLocal = Session  # type: ignore[assignment]

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def admin_user(session: AsyncSession) -> AdminUser:
    user = AdminUser(username="anirudh", password_hash=hash_password("test-pass-1234"))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
