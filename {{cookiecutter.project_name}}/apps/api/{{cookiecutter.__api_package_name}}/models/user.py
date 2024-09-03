"""This module defines the User model"""

from typing import Optional
from urllib.parse import quote_plus

from pydantic import BaseModel, HttpUrl, parse_obj_as


class User(BaseModel):
    """
    The model representing a user of the application.
    We do not persist users in our database, because usually they are managed by an external identity provider.
    """

    id: str  # it is not UUID because different identity providers often use strings other than UUID as user IDs
    username: str
    first_name: str = ""
    last_name: str = ""
    avatar_url: Optional[HttpUrl] = None

    @staticmethod
    def generate_avatar_url(name: str) -> HttpUrl:
        """Generate avatar URL for the user"""
        at = name.find("@")
        if at > 1:
            # remove email domain
            name = name[:at]

        url: HttpUrl = parse_obj_as(
            HttpUrl, f"https://ui-avatars.com/api/?background=E5E8EB&size=128&bold=true&name={quote_plus(name)}"
        )
        return url
