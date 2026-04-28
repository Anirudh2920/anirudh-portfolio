"""Shared cross-dialect column types."""
from sqlalchemy import JSON, Uuid
from sqlalchemy.dialects.postgresql import JSONB

# Native UUID on Postgres, CHAR(32) on SQLite — automatic via SQLAlchemy 2.0 Uuid.
UUIDType = Uuid(as_uuid=True)

# JSONB on Postgres, JSON on SQLite (and any other dialect).
JsonList = JSONB().with_variant(JSON(), "sqlite")
