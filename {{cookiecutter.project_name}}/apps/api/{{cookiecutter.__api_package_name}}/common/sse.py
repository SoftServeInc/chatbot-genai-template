"""Server-Sent Events (SSE) utilities"""

from typing import Any, Optional

from pydantic import BaseModel

from ..models.generic import GenericResource
from .utils import json_dump_min

SSE_CONTENT_TYPE = "text/event-stream"


def sse_event(data: Any, event: Optional[str] = None) -> str:
    """Create a Server-Sent Event message"""
    content = ""

    if event is not None:
        content += f"event: {event}\n"

    content += "data: "

    if isinstance(data, GenericResource):
        content += data.json_min()
    elif isinstance(data, BaseModel):
        content += data.json(by_alias=True, separators=(",", ":"))
    elif isinstance(data, dict):
        content += json_dump_min(data)
    else:
        content += str(data)

    content += "\n\n"

    return content
