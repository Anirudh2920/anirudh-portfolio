import uuid

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.types import UUIDType


class StackGroup(Base):
    __tablename__ = "stack_group"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)

    items: Mapped[list["StackItem"]] = relationship(
        back_populates="group",
        cascade="all, delete-orphan",
        order_by="StackItem.sort_order",
    )


class StackItem(Base):
    __tablename__ = "stack_item"
    __table_args__ = (Index("ix_stack_item_group_sort", "group_id", "sort_order"),)

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType,
        ForeignKey("stack_group.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    version: Mapped[str | None] = mapped_column(String(60))
    note: Mapped[str | None] = mapped_column(String(200))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)

    group: Mapped[StackGroup] = relationship(back_populates="items")
