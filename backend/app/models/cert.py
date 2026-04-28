import uuid

from sqlalchemy import Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin
from app.models.types import UUIDType


class Cert(Base, TimestampMixin):
    __tablename__ = "cert"
    __table_args__ = (Index("ix_cert_sort", "sort_order"),)

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    issuer: Mapped[str] = mapped_column(String(200), nullable=False)
    expiry: Mapped[str] = mapped_column(String(60), nullable=False)
    glyph: Mapped[str] = mapped_column(String(8), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)
