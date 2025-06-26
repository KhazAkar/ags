"""Unit tests for the message router stub."""
from app.message_router import MessageRouter


def test_publish_subscribe_roundtrip() -> None:  # noqa: D401
    router = MessageRouter()
    received: list[dict[str, int]] = []

    def handler(payload):  # noqa: D401, ANN001
        received.append(payload)

    router.subscribe("test/topic", handler)
    router.publish("test/topic", {"value": 42})

    assert received == [{"value": 42}]
