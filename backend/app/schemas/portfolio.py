from pydantic import BaseModel, EmailStr, Field

from app.schemas.cert import CertRead
from app.schemas.experience import ExperienceRead
from app.schemas.profile import AboutRead
from app.schemas.project import ProjectRead


class StackItemPublic(BaseModel):
    name: str
    version: str | None = None
    note: str | None = None


class ReorderEntry(BaseModel):
    id: str
    sort_order: int


class PortfolioResponse(BaseModel):
    """Aggregate response — shape mirrors the original `window.PORTFOLIO`."""

    name: str
    fullName: str
    role: str
    location: str
    email: EmailStr
    phone: str | None
    github: str | None
    linkedin: str | None

    about: AboutRead
    experience: list[ExperienceRead]
    projects: list[ProjectRead]
    stack: dict[str, list[StackItemPublic]] = Field(default_factory=dict)
    certs: list[CertRead]
