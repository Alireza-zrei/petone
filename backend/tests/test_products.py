from httpx import AsyncClient

SAMPLE_PRODUCT = {
    "name": "Chew Toy",
    "slug": "chew-toy",
    "description": "Durable rubber chew toy for dogs.",
    "price": 1299,
    "category": "toys",
    "stock": 25,
    "image_url": "https://example.com/chew-toy.png",
    "brand": "Chewy Co",
}

Headers = dict[str, str]


async def test_create_product(client: AsyncClient, admin_headers: Headers) -> None:
    response = await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    assert response.status_code == 201
    body = response.json()
    assert body["slug"] == "chew-toy"
    assert body["price"] == 1299
    assert "id" in body


async def test_create_product_requires_auth(client: AsyncClient) -> None:
    response = await client.post("/products", json=SAMPLE_PRODUCT)
    assert response.status_code == 401


async def test_create_product_forbidden_for_non_admin(
    client: AsyncClient, user_headers: Headers
) -> None:
    response = await client.post("/products", json=SAMPLE_PRODUCT, headers=user_headers)
    assert response.status_code == 403


async def test_create_product_duplicate_slug(
    client: AsyncClient, admin_headers: Headers
) -> None:
    await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    response = await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    assert response.status_code == 409


async def test_list_products(client: AsyncClient, admin_headers: Headers) -> None:
    await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    response = await client.get("/products")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["slug"] == "chew-toy"


async def test_list_products_invalid_limit(client: AsyncClient) -> None:
    response = await client.get("/products", params={"limit": 0})
    assert response.status_code == 422


async def test_get_product(client: AsyncClient, admin_headers: Headers) -> None:
    created = (
        await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    ).json()
    response = await client.get(f"/products/{created['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


async def test_get_product_not_found(client: AsyncClient) -> None:
    response = await client.get("/products/999999")
    assert response.status_code == 404


async def test_update_product(client: AsyncClient, admin_headers: Headers) -> None:
    created = (
        await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    ).json()
    response = await client.patch(
        f"/products/{created['id']}",
        json={"price": 999, "stock": 5},
        headers=admin_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["price"] == 999
    assert body["stock"] == 5
    assert body["name"] == SAMPLE_PRODUCT["name"]


async def test_update_product_not_found(client: AsyncClient, admin_headers: Headers) -> None:
    response = await client.patch(
        "/products/999999", json={"price": 999}, headers=admin_headers
    )
    assert response.status_code == 404


async def test_delete_product(client: AsyncClient, admin_headers: Headers) -> None:
    created = (
        await client.post("/products", json=SAMPLE_PRODUCT, headers=admin_headers)
    ).json()
    response = await client.delete(f"/products/{created['id']}", headers=admin_headers)
    assert response.status_code == 204
    assert (await client.get(f"/products/{created['id']}")).status_code == 404
    assert (await client.get("/products")).json() == []


async def test_delete_product_not_found(client: AsyncClient, admin_headers: Headers) -> None:
    response = await client.delete("/products/999999", headers=admin_headers)
    assert response.status_code == 404
