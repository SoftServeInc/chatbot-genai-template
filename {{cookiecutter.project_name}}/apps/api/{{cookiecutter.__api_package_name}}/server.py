"""Main entrypoint for the API server application"""

# pylint: disable=unused-import
from .app.env import _
from .app.logging import _ as __

# isort: split
from .app.app import app

__all__ = ["app"]
