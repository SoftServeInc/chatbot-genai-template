"""DTO models for the Message API endpoints"""

from pydantic import BaseModel, Field


class ProvideMessageFeedback(BaseModel):
    """DTO request model for POST /messages/{message_id}/feedback endpoint"""

    rating: int
    comment: str = Field(default="")


class MessageFeedbackAccepted(BaseModel):
    """DTO response model for POST /messages/{message_id}/feedback endpoint"""

    rating: int
