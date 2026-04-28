import uuid

from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    filename: str = Field(max_length=120)
    lang: str = Field(max_length=40)
    description: str
    problem: str
    outcome: str
    tech: list[str] = Field(default_factory=list)
    stars: str = Field(max_length=40)
    status: str = Field(max_length=40)

    model_config = ConfigDict(from_attributes=True)


class ProjectRead(ProjectBase):
    id: uuid.UUID


class ProjectCreate(ProjectBase):
    sort_order: int


class ProjectUpdate(BaseModel):
    filename: str | None = Field(default=None, max_length=120)
    lang: str | None = Field(default=None, max_length=40)
    description: str | None = None
    problem: str | None = None
    outcome: str | None = None
    tech: list[str] | None = None
    stars: str | None = Field(default=None, max_length=40)
    status: str | None = Field(default=None, max_length=40)
    sort_order: int | None = None
