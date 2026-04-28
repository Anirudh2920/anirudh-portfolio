"""Create the first admin user from env vars. Idempotent: skips if any admin exists.

Reads ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD.
"""
import asyncio
import sys

from sqlalchemy import select

from app.config import get_settings
from app.db import SessionLocal
from app.models import AdminUser
from app.security import hash_password


async def main() -> int:
    settings = get_settings()
    password = settings.admin_bootstrap_password
    username = settings.admin_bootstrap_username

    if not password:
        print(
            "bootstrap_admin: ADMIN_BOOTSTRAP_PASSWORD is not set — refusing to create user.",
            file=sys.stderr,
        )
        return 2

    if len(password.encode("utf-8")) > 72:
        print(
            "bootstrap_admin: password exceeds bcrypt 72-byte limit — pick a shorter one.",
            file=sys.stderr,
        )
        return 2

    async with SessionLocal() as session:
        existing = (await session.execute(select(AdminUser).limit(1))).scalar_one_or_none()
        if existing is not None:
            print(f"bootstrap_admin: admin already exists ({existing.username}); skipping.")
            return 0

        user = AdminUser(username=username, password_hash=hash_password(password))
        session.add(user)
        await session.commit()
        print(f"bootstrap_admin: created admin '{username}'.")
        return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
