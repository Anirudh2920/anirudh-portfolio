from fastapi import APIRouter, Depends

from app.routers.admin import certs, experience, profile, projects, stack
from app.security import get_current_admin

router = APIRouter(prefix="/admin", dependencies=[Depends(get_current_admin)])
router.include_router(profile.router)
router.include_router(experience.router)
router.include_router(projects.router)
router.include_router(stack.router)
router.include_router(certs.router)
