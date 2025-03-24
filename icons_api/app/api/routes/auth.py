from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, Response
from loguru import logger

from ...core.auth import generate_token, handle_oauth2_token, verify_token, revoke_token

__all__ = ("setup",)


router = APIRouter(prefix="/auth")


@router.post("/callback")
async def oauth2_callback(
    request: Request,
    code: str | None = None,
    session_state: str | None = None,
    error: str | None = None,
    error_description: str | None = None,
):
    if not code and not error:
        return JSONResponse({"error": "invalid_request", "error_description": "No code or error provided"}, 400)

    if error:
        return JSONResponse({"error": error, "error_description": error_description}, 400)

    async with request.app.state.session.request(
        "POST",
        f"https://login.microsoftonline.com/{request.app.state.settings.microsoft_tenant_id}/oauth2/v2.0/token",
        data={
            "client_id": request.app.state.settings.microsoft_client_id,
            "client_secret": request.app.state.settings.microsoft_client_secret.get_secret_value(),
            "code": code,
            "grant_type": "authorization_code",
            "scope": "openid profile email offline_access",
            # "redirect_uri": request.url_for("oauth2_callback"),
        },
    ) as response:
        response_data = await response.json()
        if not response.ok:
            return JSONResponse(response_data, response.status)
        scopes = response_data.get("scope", "").split()
        if "refresh_token" not in response_data or not all(scope in scopes for scope in ("openid", "profile", "email")):
            return JSONResponse(
                {
                    "error": "invalid_scope",
                    "error_description": "Missing required scopes: openid profile email offline_access",
                },
                403,
            )

        try:
            user = await handle_oauth2_token(request.app, response_data)
        except Exception as e:
            logger.info("Failed to handle OAuth2 token request", exception=e)
            return JSONResponse({"error": "invalid_request", "error_description": str(e)}, 400)
        else:
            return {"token": await generate_token(request.app, user.id)}


@router.post("/logout")
async def logout(request: Request, current_url: str | None = None):
    token = request.headers.get("Authorization", "").removeprefix("Bearer ")
    try:
        await verify_token(request.app, token)
    except Exception:
        return Response("", 204)

    await revoke_token(request.app, token)
    return {
        "url": f"https://login.microsoftonline.com/{request.app.state.settings.microsoft_tenant_id}/oauth2/v2.0/logout?post_logout_redirect_uri={current_url or request.app.state.settings.frontend_url}"
    }


def setup(api: APIRouter):
    api.include_router(router, tags=["authentication"])
