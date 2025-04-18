"""
Some common conventions for API routes:
- Use plural nouns for resource names (e.g., `/users`, `/products`).
- Properly use RESTful conventions
- Prefer idempotent PATCH over PUT
- Pagination should be implemented using ?limit and ?offset, and the response should always be {"total": 0, "items": []}
- Use JSON for request and response bodies, unless receiving files; in that case, payload_json should be used as a form field
"""

import importlib
import os

from fastapi import APIRouter
from loguru import logger

from . import *

__all__ = ("router",)

router = APIRouter()

# Import every router in a loop
for file in os.listdir(os.path.dirname(__file__)):
    if file in ("__init__.py", "api.py") or not file.endswith(".py"):
        continue

    logger.debug(f"[API] Loading {file[:-3]} router...")
    module = importlib.import_module(f".{file[:-3]}", __package__)
    module.setup(router)
