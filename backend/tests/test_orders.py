from httpx import AsyncClient

Headers = dict[str, str]


async def _add_product(
    client: AsyncClient, headers: Headers, slug: str, stock: int = 10
) -> int:
    payload = {
        "name": slug.replace("-", " ").title(),
        "slug": slug,
        "price": 4500,
        "category": "beds",
        "stock": stock,
    }
    response = await client.post("/products", json=payload, headers=headers)
    return response.json()["id"]


async def test_get_empty_cart(client: AsyncClient, user_headers: Headers) -> None:
    response = await client.get("/cart", headers=user_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["total"] == 0


async def test_cart_requires_auth(client: AsyncClient) -> None:
    response = await client.get("/cart")
    assert response.status_code == 401


async def test_add_item_to_cart(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    pid = await _add_product(client, admin_headers, "cat-bed")
    response = await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 2}, headers=user_headers
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 1
    assert body["items"][0]["quantity"] == 2
    assert body["total"] == 9000


async def test_add_same_product_increments(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    pid = await _add_product(client, admin_headers, "cat-bed")
    await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 1}, headers=user_headers
    )
    response = await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 3}, headers=user_headers
    )
    body = response.json()
    assert len(body["items"]) == 1
    assert body["items"][0]["quantity"] == 4


async def test_add_unknown_product(client: AsyncClient, user_headers: Headers) -> None:
    response = await client.post(
        "/cart/items", json={"product_id": 999999, "quantity": 1}, headers=user_headers
    )
    assert response.status_code == 404


async def test_remove_cart_item(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    pid = await _add_product(client, admin_headers, "cat-bed")
    await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 1}, headers=user_headers
    )
    response = await client.delete(f"/cart/items/{pid}", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["items"] == []


async def test_remove_missing_cart_item(
    client: AsyncClient, user_headers: Headers
) -> None:
    response = await client.delete("/cart/items/999999", headers=user_headers)
    assert response.status_code == 404


async def test_checkout(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    pid = await _add_product(client, admin_headers, "cat-bed", stock=10)
    await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 3}, headers=user_headers
    )
    response = await client.post("/orders", headers=user_headers)
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "pending"
    assert body["total_cents"] == 13500
    assert len(body["items"]) == 1
    assert body["items"][0]["unit_price"] == 4500
    assert body["items"][0]["subtotal"] == 13500

    cart = (await client.get("/cart", headers=user_headers)).json()
    assert cart["items"] == []

    product = (await client.get(f"/products/{pid}")).json()
    assert product["stock"] == 7


async def test_checkout_empty_cart(client: AsyncClient, user_headers: Headers) -> None:
    response = await client.post("/orders", headers=user_headers)
    assert response.status_code == 409


async def test_checkout_insufficient_stock(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    pid = await _add_product(client, admin_headers, "cat-bed", stock=2)
    await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 5}, headers=user_headers
    )
    response = await client.post("/orders", headers=user_headers)
    assert response.status_code == 409


async def test_list_and_get_orders(
    client: AsyncClient, admin_headers: Headers, user_headers: Headers
) -> None:
    pid = await _add_product(client, admin_headers, "cat-bed")
    await client.post(
        "/cart/items", json={"product_id": pid, "quantity": 1}, headers=user_headers
    )
    created = (await client.post("/orders", headers=user_headers)).json()

    listed = (await client.get("/orders", headers=user_headers)).json()
    assert len(listed) == 1
    assert listed[0]["id"] == created["id"]

    fetched = await client.get(f"/orders/{created['id']}", headers=user_headers)
    assert fetched.status_code == 200
    assert fetched.json()["id"] == created["id"]


async def test_get_order_not_found(client: AsyncClient, user_headers: Headers) -> None:
    response = await client.get("/orders/999999", headers=user_headers)
    assert response.status_code == 404
