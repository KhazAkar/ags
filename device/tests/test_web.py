"""Unit-tests for the Falcon web application."""
from pathlib import Path

import falcon.testing as ft
import pytest

from app import create_app


@pytest.fixture()
def client() -> ft.TestClient:  # noqa: D401
    static_dir = Path(__file__).resolve().parent.parent / "static"
    return ft.TestClient(create_app(static_dir))


def test_health_endpoint(client: ft.TestClient) -> None:  # noqa: D401
    response = client.simulate_get("/health")
    assert response.status_code == 200
    assert response.json == {"status": "ok"}
