from __future__ import annotations

import datetime
from typing import TYPE_CHECKING, Any

from jose import jwt
from loguru import logger

from ..utils.hmac import *

if TYPE_CHECKING:
    from ..api.managers.user import User
    from ..app import Application

__all__ = ("setup_oauth2", "handle_oauth2_token", "generate_token", "verify_token", "revoke_token")


async def setup_oauth2(app: Application):
    async with app.state.session.get("https://login.microsoftonline.com/common/discovery/v2.0/keys") as response:
        app.state.openid_keys = (await response.json())["keys"]


async def update_bearer(app: Application, email: str, payload: dict[str, Any]):
    await app.state.pool.execute(
        "INSERT INTO bearers (email, access_token, refresh_token, expires_at, id_token) VALUES ($1, $2, $3, $4, $5) "
        "ON CONFLICT (email) DO UPDATE SET access_token = $2, refresh_token = $3, expires_at = $4, id_token = $5",
        email,
        payload["access_token"],
        payload["refresh_token"],
        datetime.datetime.now() + datetime.timedelta(seconds=payload["expires_in"]),
        payload["id_token"],
    )


async def ensure_bearer(app: Application, email: str):
    bearer = await app.state.pool.fetchrow("SELECT * FROM bearers WHERE email = $1", email)
    if not bearer:
        raise ValueError("Bearer not found")
    if bearer["expires_at"] < datetime.datetime.now(tz=datetime.timezone.utc):
        bearer = await refresh_bearer(app, email)
    try:
        await get_userinfo(app, bearer["access_token"])
    except Exception:
        raise ValueError("Authorization is invalid")


async def get_userinfo(app: Application, token: str) -> dict[str, Any]:
    async with app.state.session.get(
        f"https://graph.microsoft.com/oidc/userinfo",
        headers={"Authorization": f"Bearer {token}"},
    ) as response:
        if not response.ok:
            logger.info(f"Retrieving userinfo for {token} returned {response.status} with {await response.text()}")
            response.raise_for_status()
        return await response.json()


async def generate_token(app: Application, id: str, *, skip_verification: bool = False) -> str:
    user = await app.state.users.get(id=id)
    if not user:
        raise ValueError("User not found")
    if not skip_verification:
        await ensure_bearer(app, user.email)

    token = sign(app.state.settings.secret_key.get_secret_value(), id)
    await app.state.pool.execute("INSERT INTO tokens (token, email) VALUES ($1, $2)", token, user.email)
    return token


async def verify_token(app: Application, token: str) -> User:
    payload = verify(app.state.settings.secret_key.get_secret_value(), token)
    if not payload:
        raise ValueError("Invalid token")
    email = await app.state.pool.fetchval("SELECT email FROM tokens WHERE token = $1", token)
    if not email:
        raise ValueError("Token not found")

    # Check if we need to verify the bearer
    expires_at = await app.state.pool.fetchval("SELECT expires_at FROM bearers WHERE email = $1", email)
    if expires_at < datetime.datetime.now(datetime.timezone.utc):
        await refresh_bearer(app, email)

    user = await app.state.users.get(id=payload)
    if not user:
        raise ValueError("User not found")
    return user


async def revoke_token(app: Application, token: str) -> None:
    await app.state.pool.execute("DELETE FROM tokens WHERE token = $1", token)


async def refresh_bearer(app: Application, email: str) -> dict[str, Any]:
    bearer = await app.state.pool.fetchrow("SELECT * FROM bearers WHERE email = $1", email)
    if not bearer:
        raise ValueError("Bearer not found")
    async with app.state.session.post(
        f"https://login.microsoftonline.com/{app.state.settings.microsoft_tenant_id}/oauth2/v2.0/token",
        data={
            "client_id": app.state.settings.microsoft_client_id,
            "client_secret": app.state.settings.microsoft_client_secret.get_secret_value(),
            "grant_type": "refresh_token",
            "refresh_token": bearer["refresh_token"],
        },
    ) as response:
        if not response.ok:
            logger.info(f"Refreshing token {email} returned {response.status} with {await response.text()}")
            response.raise_for_status()
        payload = await response.json()
        await update_bearer(app, email, payload)
        return payload


async def handle_oauth2_token(app: Application, payload: dict[str, Any]) -> User:
    header = jwt.get_unverified_header(payload["id_token"])
    key = None
    for key in app.state.openid_keys:
        if key["kid"] == header["kid"]:
            break
    if not key:
        raise ValueError("JWT kid not found")

    _jwt = jwt.decode(
        payload["id_token"],
        key,
        algorithms=["RS256"],
        audience=app.state.settings.microsoft_client_id,
    )
    email = _jwt["email"]
    if not email.endswith("@queensu.ca"):
        raise ValueError("Only Queen's University members are allowed to access this service")

    user = await app.state.users.create(email=email, name=_jwt["name"], ignore_conflict=True)
    await update_bearer(app, email, payload)
    return user
