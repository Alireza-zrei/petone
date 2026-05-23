import pytest
from httpx import AsyncClient

REGISTRATION = {
    "email": "ada@petone.com",
    "password": "password123",
    "full_name": "Ada Lovelace",
    "phone": "09124301159",
}


async def _register(client: AsyncClient) -> None:
    await client.post("/auth/register", json=REGISTRATION)


async def _login(client: AsyncClient) -> dict[str, str]:
    response = await client.post(
        "/auth/login",
        json={"email": REGISTRATION["email"], "password": REGISTRATION["password"]},
    )
    return response.json()


async def test_register(client: AsyncClient) -> None:
    response = await client.post("/auth/register", json=REGISTRATION)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "ada@petone.com"
    assert body["is_admin"] is False
    assert "hashed_password" not in body


async def test_register_duplicate_email(client: AsyncClient) -> None:
    await client.post("/auth/register", json=REGISTRATION)
    response = await client.post("/auth/register", json=REGISTRATION)
    assert response.status_code == 409


async def test_login(client: AsyncClient) -> None:
    await _register(client)
    response = await client.post(
        "/auth/login",
        json={"email": REGISTRATION["email"], "password": REGISTRATION["password"]},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


async def test_login_wrong_password(client: AsyncClient) -> None:
    await _register(client)
    response = await client.post(
        "/auth/login",
        json={"email": REGISTRATION["email"], "password": "wrongpassword"},
    )
    assert response.status_code == 401


async def test_refresh(client: AsyncClient) -> None:
    await _register(client)
    tokens = await _login(client)
    response = await client.post(
        "/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["refresh_token"]


async def test_refresh_rejects_access_token(client: AsyncClient) -> None:
    await _register(client)
    tokens = await _login(client)
    response = await client.post(
        "/auth/refresh", json={"refresh_token": tokens["access_token"]}
    )
    assert response.status_code == 401


async def test_refresh_rotates_token(client: AsyncClient) -> None:
    """A refresh token can only be redeemed once; reuse must fail."""
    await _register(client)
    tokens = await _login(client)
    first = await client.post(
        "/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert first.status_code == 200
    replay = await client.post(
        "/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert replay.status_code == 401


async def test_logout_revokes_refresh(client: AsyncClient) -> None:
    await _register(client)
    tokens = await _login(client)
    logout = await client.post(
        "/auth/logout", json={"refresh_token": tokens["refresh_token"]}
    )
    assert logout.status_code == 204
    response = await client.post(
        "/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert response.status_code == 401


async def test_logout_unknown_token_is_idempotent(client: AsyncClient) -> None:
    response = await client.post(
        "/auth/logout", json={"refresh_token": "not-a-real-token"}
    )
    assert response.status_code == 204


async def test_me(client: AsyncClient) -> None:
    await _register(client)
    tokens = await _login(client)
    response = await client.get(
        "/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "ada@petone.com"


async def test_me_requires_auth(client: AsyncClient) -> None:
    response = await client.get("/auth/me")
    assert response.status_code == 401


async def test_register_normalizes_phone(client: AsyncClient) -> None:
    """Iranian mobile numbers in various forms collapse to the 10-digit form."""
    response = await client.post("/auth/register", json=REGISTRATION)
    assert response.status_code == 201
    assert response.json()["phone"] == "9124301159"


async def test_register_accepts_persian_digit_phone(client: AsyncClient) -> None:
    """Persian-keyboard input like ۰۹۱۲... must normalize, not be rejected."""
    payload = {**REGISTRATION, "phone": "۰۹۱۲۴۳۰۱۱۵۹"}
    response = await client.post("/auth/register", json=payload)
    assert response.status_code == 201
    assert response.json()["phone"] == "9124301159"


async def test_register_rejects_invalid_phone(client: AsyncClient) -> None:
    payload = {**REGISTRATION, "phone": "not-a-number"}
    response = await client.post("/auth/register", json=payload)
    # InvalidPhoneNumber is a ConflictError → 409
    assert response.status_code == 409


async def test_register_duplicate_phone(client: AsyncClient) -> None:
    await client.post("/auth/register", json=REGISTRATION)
    response = await client.post(
        "/auth/register",
        json={**REGISTRATION, "email": "second@petone.com"},
    )
    assert response.status_code == 409


# --- OTP-based phone login ---


@pytest.fixture
def fixed_otp(monkeypatch: pytest.MonkeyPatch) -> str:
    """Pin OTP generation to a known value so verify-step tests are deterministic."""
    code = "123456"
    monkeypatch.setattr("app.domains.users.otp.generate_otp_code", lambda: code)
    return code


async def test_login_otp_full_flow(
    client: AsyncClient, fixed_otp: str
) -> None:
    await _register(client)
    request = await client.post(
        "/auth/login/otp/request", json={"mobile": REGISTRATION["phone"]}
    )
    assert request.status_code == 202
    verify = await client.post(
        "/auth/login/otp/verify",
        json={"mobile": REGISTRATION["phone"], "code": fixed_otp},
    )
    assert verify.status_code == 200
    body = verify.json()
    assert body["access_token"] and body["refresh_token"]


async def test_login_otp_request_unknown_phone_is_202(
    client: AsyncClient,
) -> None:
    """Phone enumeration is blocked: unknown numbers still return 202."""
    response = await client.post(
        "/auth/login/otp/request", json={"mobile": "9120000099"}
    )
    assert response.status_code == 202


async def test_login_otp_verify_wrong_code(
    client: AsyncClient, fixed_otp: str
) -> None:
    await _register(client)
    await client.post(
        "/auth/login/otp/request", json={"mobile": REGISTRATION["phone"]}
    )
    response = await client.post(
        "/auth/login/otp/verify",
        json={"mobile": REGISTRATION["phone"], "code": "000000"},
    )
    assert response.status_code == 401


async def test_login_otp_code_is_single_use(
    client: AsyncClient, fixed_otp: str
) -> None:
    await _register(client)
    await client.post(
        "/auth/login/otp/request", json={"mobile": REGISTRATION["phone"]}
    )
    first = await client.post(
        "/auth/login/otp/verify",
        json={"mobile": REGISTRATION["phone"], "code": fixed_otp},
    )
    assert first.status_code == 200
    replay = await client.post(
        "/auth/login/otp/verify",
        json={"mobile": REGISTRATION["phone"], "code": fixed_otp},
    )
    assert replay.status_code == 401


async def test_login_otp_resend_too_soon(
    client: AsyncClient, fixed_otp: str
) -> None:
    await _register(client)
    first = await client.post(
        "/auth/login/otp/request", json={"mobile": REGISTRATION["phone"]}
    )
    assert first.status_code == 202
    second = await client.post(
        "/auth/login/otp/request", json={"mobile": REGISTRATION["phone"]}
    )
    assert second.status_code == 409  # OtpResendTooSoon


# --- OTP-based password reset ---


async def test_password_reset_full_flow(
    client: AsyncClient, fixed_otp: str
) -> None:
    await _register(client)
    request = await client.post(
        "/auth/password-reset/request", json={"mobile": REGISTRATION["phone"]}
    )
    assert request.status_code == 202
    verify = await client.post(
        "/auth/password-reset/verify",
        json={
            "mobile": REGISTRATION["phone"],
            "code": fixed_otp,
            "new_password": "brand-new-pass-1",
        },
    )
    assert verify.status_code == 200
    # The new password works.
    relog = await client.post(
        "/auth/login",
        json={"email": REGISTRATION["email"], "password": "brand-new-pass-1"},
    )
    assert relog.status_code == 200
    # The old password no longer works.
    old = await client.post(
        "/auth/login",
        json={"email": REGISTRATION["email"], "password": REGISTRATION["password"]},
    )
    assert old.status_code == 401


async def test_password_reset_revokes_existing_refresh_tokens(
    client: AsyncClient, fixed_otp: str
) -> None:
    """A password reset must terminate any active session for the user."""
    await _register(client)
    pre_reset = await _login(client)
    await client.post(
        "/auth/password-reset/request", json={"mobile": REGISTRATION["phone"]}
    )
    await client.post(
        "/auth/password-reset/verify",
        json={
            "mobile": REGISTRATION["phone"],
            "code": fixed_otp,
            "new_password": "brand-new-pass-1",
        },
    )
    response = await client.post(
        "/auth/refresh", json={"refresh_token": pre_reset["refresh_token"]}
    )
    assert response.status_code == 401
