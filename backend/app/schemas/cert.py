import uuid

from pydantic import BaseModel, ConfigDict, Field


class CertBase(BaseModel):
    name: str = Field(max_length=200)
    issuer: str = Field(max_length=200)
    expiry: str = Field(max_length=60)
    glyph: str = Field(max_length=8)

    model_config = ConfigDict(from_attributes=True)


class CertRead(CertBase):
    id: uuid.UUID


class CertCreate(CertBase):
    sort_order: int


class CertUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=200)
    issuer: str | None = Field(default=None, max_length=200)
    expiry: str | None = Field(default=None, max_length=60)
    glyph: str | None = Field(default=None, max_length=8)
    sort_order: int | None = None
