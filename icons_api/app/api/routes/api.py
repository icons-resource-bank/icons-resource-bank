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

    logger.debug(f"[API] Importing {file}...")
    module = importlib.import_module(f".{file[:-3]}", __package__)
    module.setup(router)
