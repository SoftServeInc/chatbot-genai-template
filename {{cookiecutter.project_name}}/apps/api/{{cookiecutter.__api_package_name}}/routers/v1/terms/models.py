"""DTO models for the Terms API endpoints"""

from pydantic import BaseModel, Field, HttpUrl


class TermsReference(BaseModel):
    """DTO request model for POST /terms endpoint"""

    url: HttpUrl = Field(
        ...,
        description="The URL of the new terms of service version",
        example="https://www.softserveinc.com/en-us/terms-and-conditions",
    )
