from fastapi import APIRouter
from fastapi.responses import JSONResponse, Response
from loguru import logger
from datetime import timedelta

from ...core.errors import CustomValidationError
from ..models.auth import AuthCallbackRequest
from ...core.auth import generate_token, handle_oauth2_token, revoke_token
from ...request import Request
from ...utils import utcnow

__all__ = ("setup",)


router = APIRouter(prefix="/auth")


@router.post("/callback")
async def oauth2_callback(request: Request, data: AuthCallbackRequest):
    if data.error:
        return JSONResponse({"error": data.error, "error_description": data.error_description}, 400)

    async with request.app.state.session.request(
        "POST",
        f"https://login.microsoftonline.com/{request.app.state.settings.microsoft_tenant_id}/oauth2/v2.0/token",
        data={
            "client_id": request.app.state.settings.microsoft_client_id,
            "client_secret": request.app.state.settings.microsoft_client_secret.get_secret_value(),
            "code": data.code,
            "grant_type": "authorization_code",
            "scope": "openid profile email offline_access",
            "redirect_uri": data.redirect_uri,
        },
    ) as response:
        response_data = await response.json()
        if not response.ok:
            raise CustomValidationError(
                [response_data.get("error", "unknown_error"), response_data.get("error_description", "Unknown error")],
                status_code=response.status,
            )
        scopes = response_data.get("scope", "").split()
        if "refresh_token" not in response_data or not all(scope in scopes for scope in ("openid", "profile", "email")):
            raise CustomValidationError(
                "Missing required scopes: openid profile email offline_access",
                status_code=403,
            )

        try:
            user = await handle_oauth2_token(request.app, response_data)
        except Exception as e:
            logger.info("Failed to handle OAuth2 token request", exception=e)
            raise CustomValidationError(f"Invalid request: {e}", status_code=400)
        else:
            return JSONResponse(
                {
                    "token": await generate_token(request.app, user.id),
                    "new_user": utcnow() - user.created_at < timedelta(minutes=5),
                }
            )


@router.post("/logout")
async def logout(request: Request, current_url: str | None = None):
    me = request.state.user
    if not me:
        return Response(status_code=204)

    token = request.headers.get("Authorization", "").removeprefix("Bearer ")
    await revoke_token(request.app, token)
    return JSONResponse(
        {
            "url": f"https://login.microsoftonline.com/{request.app.state.settings.microsoft_tenant_id}/oauth2/v2.0/logout?post_logout_redirect_uri={current_url or request.app.state.settings.frontend_url}"
        }
    )


def setup(api: APIRouter):
    api.include_router(router, tags=["authentication"])
