from httpx import AsyncClient

from app.rate_limit import limiter


async def test_login_is_rate_limited(client: AsyncClient) -> None:
    # The autouse conftest fixture disables the limiter; turn it back on here.
    limiter.enabled = True
    statuses = set()
    for _ in range(15):
        response = await client.post(
            "/auth/login",
            json={"email": "nobody@petone.com", "password": "whatever"},
        )
        statuses.add(response.status_code)
    # login is capped at 10/minute, so some of the 15 attempts must be rejected
    assert 429 in statuses
