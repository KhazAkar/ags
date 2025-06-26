"""Light-weight, in-memory message router.

This is only a placeholder implementation – in production it may be replaced by
an MQTT-based solution or any other IPC bus. The interface is kept minimal in
order to stay flexible while still enabling early unit-testing.
"""
from __future__ import annotations

from typing import Any, Callable 

Handler = Callable[[Any], None]


class MessageRouter:
    """A simple publish/subscribe router for local communication."""

    def __init__(self) -> None:  # noqa: D401
        self._subscribers: dict[str, list[Handler]] = {}

    def subscribe(self, topic: str, handler: Handler) -> None:
        """Register *handler* to be invoked whenever *topic* is published."""
        self._subscribers.setdefault(topic, []).append(handler)

    def publish(self, topic: str, message: Any) -> None:
        """Send *message* to all handlers subscribed to *topic*."""
        for handler in self._subscribers.get(topic, []):
            handler(message)

    # Backwards-compat alias – will be removed once the API settles.
    register = subscribe
    send = publish

    # Convenience magic-methods ------------------------------------------------
    def __len__(self) -> int:  # noqa: D401
        return sum(len(h) for h in self._subscribers.values())

    def __bool__(self) -> bool:  # noqa: D401
        return bool(self._subscribers)
