"""
Pytest configuration and fixtures for testing the Autonomous Gardening System.
"""
import asyncio
import pytest
from unittest.mock import MagicMock, patch

from app.core.message_router import MessageRouter, Message, MessageType

# Enable asyncio mode for all tests
pytest_plugins = ('pytest_asyncio',)

@pytest.fixture
def mock_mqtt_client():
    """Create a mock MQTT client."""
    with patch('paho.mqtt.client.Client') as mock:
        yield mock

@pytest.fixture
def message_router():
    """Create a message router instance for testing."""
    return MessageRouter()

@pytest.fixture
def mock_platform_handler(message_router):
    """Create a mock platform handler."""
    with patch('app.core.platform_handler.PlatformHandler') as mock:
        mock.return_value.initialize = asyncio.coroutine(lambda: None)
        mock.return_value.cleanup = asyncio.coroutine(lambda: None)
        mock.return_value.read_sensors = asyncio.coroutine(lambda: None)
        yield mock

@pytest.fixture
def test_message():
    """Create a test message."""
    return Message(
        msg_type=MessageType.SYSTEM_EVENT,
        payload={"event": "test"},
        source="test"
    )
