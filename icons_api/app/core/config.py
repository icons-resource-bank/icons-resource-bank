import os
from functools import cache
from typing import Dict, Type

from .settings import *

environments: Dict[Environment, Type[Settings]] = {
    Environment.prod: ProdSettings,
    Environment.dev: DevSettings,
    Environment.test: TestSettings,
}


@cache
def get_app_settings() -> Settings:
    env = Environment(os.getenv("APP_ENV", Environment.dev.value))
    return environments[Environment(env)]()  # type: ignore
