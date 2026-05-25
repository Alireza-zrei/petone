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
        "parameters": [{"name": "CODE", "value": code}],
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
            logger.info("SMS.ir response mobile=%s body=%s", mobile, response.text)
        except httpx.HTTPStatusError as exc:
            logger.error(
                "SMS.ir HTTP %s mobile=%s body=%s",
                exc.response.status_code, mobile, exc.response.text,
            )
        except httpx.HTTPError as exc:
            logger.error(
                "SMS.ir send failed mobile=%s type=%s detail=%r",
                mobile, type(exc).__name__, exc,
            )
