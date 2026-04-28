from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Cert, Experience, Profile, Project, StackGroup
from app.schemas.cert import CertRead
from app.schemas.experience import ExperienceRead
from app.schemas.portfolio import PortfolioResponse, StackItemPublic
from app.schemas.profile import AboutRead
from app.schemas.project import ProjectRead


async def build_portfolio(session: AsyncSession) -> PortfolioResponse:
    """Build the public aggregate response.

    NOTE: stack groups are returned as an ordered dict keyed by slug. We rely on
    Python's insertion-ordered dicts; consumers should not re-sort by key.
    """
    profile = (await session.execute(select(Profile).where(Profile.id == 1))).scalar_one()

    experiences = (
        await session.execute(select(Experience).order_by(Experience.sort_order))
    ).scalars().all()

    projects = (
        await session.execute(select(Project).order_by(Project.sort_order))
    ).scalars().all()

    groups = (
        await session.execute(
            select(StackGroup)
            .options(selectinload(StackGroup.items))
            .order_by(StackGroup.sort_order)
        )
    ).scalars().all()

    certs = (await session.execute(select(Cert).order_by(Cert.sort_order))).scalars().all()

    stack: dict[str, list[StackItemPublic]] = {}
    for group in groups:
        stack[group.slug] = [
            StackItemPublic(name=item.name, version=item.version, note=item.note)
            for item in group.items  # already ordered by sort_order via relationship
        ]

    return PortfolioResponse(
        name=profile.name,
        fullName=profile.full_name,
        role=profile.role,
        location=profile.location,
        email=profile.email,  # type: ignore[arg-type]
        phone=profile.phone,
        github=profile.github,
        linkedin=profile.linkedin,
        about=AboutRead(raw=profile.about_markdown),
        experience=[ExperienceRead.model_validate(e) for e in experiences],
        projects=[ProjectRead.model_validate(p) for p in projects],
        stack=stack,
        certs=[CertRead.model_validate(c) for c in certs],
    )
