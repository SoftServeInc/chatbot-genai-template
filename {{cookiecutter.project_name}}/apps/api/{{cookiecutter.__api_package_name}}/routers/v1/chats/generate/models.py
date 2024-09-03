"""DTO models for the Chat Generate API endpoints"""

from pydantic import BaseModel


class GeneratedTitle(BaseModel):
    """DTO response model for POST /chats/generate/title endpoint"""

    title: str
