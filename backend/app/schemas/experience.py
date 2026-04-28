import uuid

from pydantic import BaseModel, ConfigDict, Field


class ExperienceBase(BaseModel):
    hash: str = Field(max_length=16)
    date: str = Field(max_length=80, alias="date_range")
    author: str = Field(max_length=120)
    role: str = Field(max_length=200)
    company: str = Field(max_length=200)
    message: str
    diff: list[str] = Field(default_factory=list, alias="bullets")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class ExperienceRead(ExperienceBase):
    id: uuid.UUID


class ExperienceCreate(BaseModel):
    hash: str = Field(max_length=16)
    date_range: str = Field(max_length=80)
    author: str = Field(max_length=120)
    role: str = Field(max_length=200)
    company: str = Field(max_length=200)
    message: str
    bullets: list[str] = Field(default_factory=list)
    sort_order: int


class ExperienceUpdate(BaseModel):
    hash: str | None = Field(default=None, max_length=16)
    date_range: str | None = Field(default=None, max_length=80)
    author: str | None = Field(default=None, max_length=120)
    role: str | None = Field(default=None, max_length=200)
    company: str | None = Field(default=None, max_length=200)
    message: str | None = None
    bullets: list[str] | None = None
    sort_order: int | None = None
