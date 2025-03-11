from functools import lru_cache
from typing import Dict, Type

from .settings import *

environments: Dict[AppEnvTypes, Type[AppSettings]] = {
    AppEnvTypes.dev: DevAppSettings,
    AppEnvTypes.prod: ProdAppSettings,
    AppEnvTypes.test: TestAppSettings,
}


@lru_cache
def get_app_settings() -> AppSettings:
    config = environments[AppEnvTypes.prod]  # TODO: Detect environment
    return config()
