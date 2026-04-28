async def test_login_success_then_me(client, admin_user):  # noqa: ARG001
    r = await client.post(
        "/api/auth/login",
        json={"username": "anirudh", "password": "test-pass-1234"},
    )
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data and data["expires_in"] > 0

    me = await client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {data['access_token']}"}
    )
    assert me.status_code == 200
    assert me.json() == {"username": "anirudh"}


async def test_login_invalid_credentials(client, admin_user):  # noqa: ARG001
    r = await client.post(
        "/api/auth/login",
        json={"username": "anirudh", "password": "wrong"},
    )
    assert r.status_code == 401


async def test_admin_route_requires_auth(client):
    r = await client.get("/api/admin/projects")
    assert r.status_code == 401


async def test_healthz(client):
    r = await client.get("/api/healthz")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
