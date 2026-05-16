from fastapi import APIRouter

from app.deps import CurrentUser, Database
from app.dto.auth import UserResponse
from app.operations.user_ops import list_users

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
async def list_all_users(_: CurrentUser, db: Database) -> list[UserResponse]:
    return await list_users(db)
