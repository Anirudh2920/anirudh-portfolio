import uuid

from sqlalchemy import Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin
from app.models.types import JsonList, UUIDType


class Experience(Base, TimestampMixin):
    __tablename__ = "experience"
    __table_args__ = (Index("ix_experience_sort", "sort_order"),)

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    hash: Mapped[str] = mapped_column(String(16), nullable=False)
    date_range: Mapped[str] = mapped_column(String(80), nullable=False)
    author: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(200), nullable=False)
    company: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    bullets: Mapped[list[str]] = mapped_column(JsonList, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)
