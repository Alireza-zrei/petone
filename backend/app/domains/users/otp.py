"""OTP generation, persistence, and verification.

The OTP code is hashed with sha256 before storage so a DB leak does not
trivially reveal in-flight codes. Codes themselves are short and high-frequency
so bcrypt would be unnecessary overhead.
"""
import hashlib
import logging
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.domains.users.models import OtpCode, OtpPurpose
from app.domains.users.sms import send_otp_sms
from app.exceptions import (
    NoPendingOtp,
    OtpExpired,
    OtpInvalid,
    OtpMaxAttemptsExceeded,
    OtpResendTooSoon,
)

logger = logging.getLogger(__name__)


def generate_otp_code() -> str:
    """6-digit zero-padded numeric code (cryptographically random)."""
    return "".join(
        secrets.choice("0123456789") for _ in range(settings.otp_code_length)
    )


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


async def _latest_for(
    db: AsyncSession, mobile: str, purpose: OtpPurpose
) -> OtpCode | None:
    result = await db.execute(
        select(OtpCode)
        .where(OtpCode.mobile == mobile, OtpCode.purpose == purpose.value)
        .order_by(desc(OtpCode.id))
        .limit(1)
    )
    return result.scalar_one_or_none()


def _as_utc(value: datetime) -> datetime:
    """SQLite returns naive datetimes; treat them as UTC."""
    return value if value.tzinfo is not None else value.replace(tzinfo=UTC)


async def issue(db: AsyncSession, mobile: str, purpose: OtpPurpose) -> None:
    """Generate, store, and dispatch a fresh OTP for (mobile, purpose).

    Throws OtpResendTooSoon if the previous code for this pair was issued
    inside the cooldown window — protects against SMS flooding regardless of
    HTTP-level rate limits.
    """
    now = datetime.now(UTC)
    latest = await _latest_for(db, mobile, purpose)
    if latest is not None and latest.consumed_at is None:
        elapsed = (now - _as_utc(latest.created_at)).total_seconds()
        remaining = settings.otp_resend_cooldown_seconds - int(elapsed)
        if remaining > 0:
            raise OtpResendTooSoon(remaining)
    code = generate_otp_code()
    row = OtpCode(
        mobile=mobile,
        code_hash=_hash_code(code),
        purpose=purpose.value,
        expires_at=now + timedelta(seconds=settings.otp_ttl_seconds),
    )
    db.add(row)
    await db.commit()
    await send_otp_sms(mobile, code)
    logger.info("Issued OTP mobile=%s purpose=%s", mobile, purpose.value)


async def verify(
    db: AsyncSession, mobile: str, purpose: OtpPurpose, code: str
) -> None:
    """Consume the latest unconsumed OTP for (mobile, purpose).

    Single source of truth for "is this OTP good right now". Raises an
    OtpInvalid subclass per failure mode (NoPendingOtp / OtpExpired /
    OtpMaxAttemptsExceeded / OtpInvalid) — they all share the same
    user-facing message so callers don't leak "wrong code" vs. "expired" vs.
    "no pending OTP" to attackers, but server logs can distinguish them.
    """
    latest = await _latest_for(db, mobile, purpose)
    if latest is None or latest.consumed_at is not None:
        logger.warning("NoPendingOtp mobile=%s purpose=%s", mobile, purpose.value)
        raise NoPendingOtp()
    now = datetime.now(UTC)
    if _as_utc(latest.expires_at) <= now:
        logger.warning("OtpExpired mobile=%s purpose=%s", mobile, purpose.value)
        raise OtpExpired()
    if latest.attempts >= settings.otp_max_attempts:
        logger.warning(
            "OtpMaxAttemptsExceeded mobile=%s purpose=%s attempts=%s",
            mobile, purpose.value, latest.attempts,
        )
        raise OtpMaxAttemptsExceeded()
    if latest.code_hash != _hash_code(code):
        latest.attempts += 1
        await db.commit()
        logger.info(
            "OtpInvalid mobile=%s purpose=%s attempt=%s",
            mobile, purpose.value, latest.attempts,
        )
        raise OtpInvalid()
    latest.consumed_at = now
    await db.commit()
