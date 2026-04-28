import uuid

from pydantic import BaseModel, ConfigDict, Field


class StackItemBase(BaseModel):
    name: str = Field(max_length=120)
    version: str | None = Field(default=None, max_length=60)
    note: str | None = Field(default=None, max_length=200)

    model_config = ConfigDict(from_attributes=True)


class StackItemRead(StackItemBase):
    id: uuid.UUID
    group_id: uuid.UUID


class StackItemCreate(StackItemBase):
    sort_order: int


class StackItemUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    version: str | None = Field(default=None, max_length=60)
    note: str | None = Field(default=None, max_length=200)
    sort_order: int | None = None


class StackGroupBase(BaseModel):
    slug: str = Field(max_length=60)
    label: str = Field(max_length=120)

    model_config = ConfigDict(from_attributes=True)


class StackGroupRead(StackGroupBase):
    id: uuid.UUID
    items: list[StackItemRead] = Field(default_factory=list)


class StackGroupCreate(StackGroupBase):
    sort_order: int


class StackGroupUpdate(BaseModel):
    slug: str | None = Field(default=None, max_length=60)
    label: str | None = Field(default=None, max_length=120)
    sort_order: int | None = None
