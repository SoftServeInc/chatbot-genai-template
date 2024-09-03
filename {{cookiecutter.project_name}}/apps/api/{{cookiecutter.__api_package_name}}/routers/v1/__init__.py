"""API router for /v1/* endpoints"""

from logging import getLogger

from fastapi import APIRouter
from fastapi.responses import Response

from ...app.schemas import responses
from .chats.router import chats
from .messages.router import messages
from .terms.router import terms
from .users.router import users

__all__ = ["v1"]

logger = getLogger(__name__)

v1 = APIRouter(prefix="/v1")

v1.include_router(users)
v1.include_router(chats)
v1.include_router(messages)
v1.include_router(terms)


@v1.get(
    "/ping",
    tags=["health"],
    status_code=200,
    responses={
        200: {
            "description": "API is running and ready to serve requests",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "data": {
                                "type": "object",
                                "properties": {
                                    "pong": {
                                        "type": "boolean",
                                        "example": "true",
                                        "description": "Always `true` if the API is running",
                                    },
                                },
                                "required": ["pong"],
                            },
                        },
                        "required": ["data"],
                    },
                }
            },
        },
    },
)
async def ping():
    """Simple ping-pong endpoint used by frontend app to check if the API is running"""
    return {"data": {"pong": True}}


@v1.get("/noop", tags=["health"], responses=responses(204), status_code=204, response_class=Response)
async def noop() -> None:
    """No operation endpoint used for heartbeating"""
