"""SMS.ir client for the OTP /v1/send/verify endpoint.

Designed to no-op when `SMSIR_API_KEY` or `SMSIR_TEMPLATE_ID` is unset so that
local development and the test suite never burn real SMS credits. The OTP code
is logged at WARNING level in that case so developers can copy it from the log.
"""
import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def send_otp_sms(mobile: str, code: str) -> None:
    if not settings.smsir_api_key or not settings.smsir_template_id:
        logger.warning(
            "SMS.ir not configured; OTP for mobile=%s would be: %s", mobile, code
        )
        return
    url = f"{settings.smsir_base_url.rstrip('/')}/v1/send/verify"
    payload = {
        "mobile": mobile,
        "templateId": settings.smsir_template_id,
        "parameters": [{"name": "Code", "value": code}],
    }
    headers = {
        "Content-Type": "application/json",
        "Accept": "text/plain",
        "x-api-key": settings.smsir_api_key,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPError as exc:
            # We swallow the gateway error after logging — the OTP row is
            # already persisted, so the user can request a resend without
            # leaking the upstream failure (and without enumeration via
            # differential timing on success vs. SMS.ir errors).
            logger.error("SMS.ir send failed mobile=%s: %s", mobile, exc)
