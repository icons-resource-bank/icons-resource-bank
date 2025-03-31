import os
from functools import cache
from typing import Dict, Type

from loguru import logger

from .settings import *

environments: Dict[Environment, Type[Settings]] = {
    Environment.prod: ProdSettings,
    Environment.dev: DevSettings,
    Environment.test: TestSettings,
}


@cache
def get_app_settings() -> Settings:
    env = Environment(os.getenv("APP_ENV", Environment.dev.value))
    logger.info(f"Loading settings for environment: {env.name.upper()}")
    return environments[Environment(env)]()  # type: ignore
