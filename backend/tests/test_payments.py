from httpx import AsyncClient

Headers = dict[str, str]


async def _make_order(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> int:
    payload = {
        "name": "Dog Leash",
        "slug": "dog-leash",
        "price": 3000,
        "category": "leashes",
        "stock": 5,
        "brand": "LeashCo",
    }
    pid = (
        await client.post("/products", json=payload, headers=admin_headers)
    ).json()["id"]
    await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 2}, headers=user_headers
    )
    return (await client.post("/orders", headers=user_headers)).json()["id"]


async def test_pay_order_returns_payment_url(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    order_id = await _make_order(client, admin_headers, user_headers)
    response = await client.post(f"/orders/{order_id}/pay", headers=user_headers)
    assert response.status_code == 201
    body = response.json()
    assert body["payment_url"]
    assert body["authority"]


async def test_pay_unknown_order(client: AsyncClient, user_headers: Headers) -> None:
    response = await client.post("/orders/999999/pay", headers=user_headers)
    assert response.status_code == 404


async def test_pay_requires_auth(client: AsyncClient) -> None:
    response = await client.post("/orders/1/pay")
    assert response.status_code == 401


async def test_full_payment_flow_marks_order_paid(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    order_id = await _make_order(client, admin_headers, user_headers)
    pay = (
        await client.post(f"/orders/{order_id}/pay", headers=user_headers)
    ).json()
    # the fake gateway's payment_url points back at our own callback
    result = await client.get(pay["payment_url"])
    assert result.status_code == 303
    assert "status=success" in result.headers["location"]

    order = (
        await client.get(f"/orders/{order_id}", headers=user_headers)
    ).json()
    assert order["status"] == "paid"


async def test_pay_already_paid_order(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    order_id = await _make_order(client, admin_headers, user_headers)
    pay = (
        await client.post(f"/orders/{order_id}/pay", headers=user_headers)
    ).json()
    await client.get(pay["payment_url"])
    response = await client.post(f"/orders/{order_id}/pay", headers=user_headers)
    assert response.status_code == 409


async def test_callback_with_gateway_failure(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    order_id = await _make_order(client, admin_headers, user_headers)
    pay = (
        await client.post(f"/orders/{order_id}/pay", headers=user_headers)
    ).json()
    result = await client.get(
        f"/payments/callback?authority={pay['authority']}&status=NOK"
    )
    assert result.status_code == 303
    assert "status=failed" in result.headers["location"]

    order = (
        await client.get(f"/orders/{order_id}", headers=user_headers)
    ).json()
    assert order["status"] == "pending"


async def test_callback_unknown_authority(client: AsyncClient) -> None:
    response = await client.get("/payments/callback?authority=BOGUS&status=OK")
    assert response.status_code == 404
