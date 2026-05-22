from httpx import AsyncClient

REGISTRATION = {
    "email": "ada@petone.com",
    "password": "password123",
    "full_name": "Ada Lovelace",
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
