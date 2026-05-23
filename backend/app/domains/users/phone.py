"""Iranian mobile-number normalization.

Accepts the four forms users commonly type and normalizes to a bare 10-digit
form starting with `9` (e.g. `9124301159`) — the shape SMS.ir expects in the
`mobile` field of /v1/send/verify. Persian (۰-۹) and Arabic-Indic (٠-٩) digits
are accepted on input — Iranian keyboards routinely emit them.
"""
import re

from app.exceptions import InvalidPhoneNumber

_NON_ALLOWED = re.compile(r"[\s\-()+]")
_PERSIAN_DIGIT_OFFSET = ord("۰") - ord("0")
_ARABIC_DIGIT_OFFSET = ord("٠") - ord("0")


def _to_ascii_digits(s: str) -> str:
    out: list[str] = []
    for ch in s:
        if "۰" <= ch <= "۹":
            out.append(chr(ord(ch) - _PERSIAN_DIGIT_OFFSET))
        elif "٠" <= ch <= "٩":
            out.append(chr(ord(ch) - _ARABIC_DIGIT_OFFSET))
        else:
            out.append(ch)
    return "".join(out)


def normalize_iranian_mobile(raw: str) -> str:
    cleaned = _NON_ALLOWED.sub("", _to_ascii_digits(raw))
    if cleaned.startswith("0098"):
        cleaned = cleaned[4:]
    elif cleaned.startswith("98") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    if cleaned.startswith("0"):
        cleaned = cleaned[1:]
    if len(cleaned) != 10 or not cleaned.startswith("9") or not cleaned.isdigit():
        raise InvalidPhoneNumber(raw)
    return cleaned
