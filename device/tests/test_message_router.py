"""Tests for the message router component."""
import asyncio
import pytest
from unittest.mock import AsyncMock

from app.core.message_router import MessageRouter, Message, MessageType

@pytest.mark.asyncio
async def test_subscribe_and_publish(message_router, test_message):
    """Test subscribing to and publishing messages."""
    # Create a mock callback
    callback = AsyncMock()
    
    # Subscribe to message type
    message_router.subscribe(MessageType.SYSTEM_EVENT, callback)
    
    # Publish a message
    await message_router.publish(test_message)
    
    # Check that the callback was called with the message
    callback.assert_called_once_with(test_message)

@pytest.mark.asyncio
async def test_multiple_handlers(message_router, test_message):
    """Test that multiple handlers are called for the same message type."""
    # Create mock callbacks
    callback1 = AsyncMock()
    callback2 = AsyncMock()
    
    # Subscribe both callbacks
    message_router.subscribe(MessageType.SYSTEM_EVENT, callback1)
    message_router.subscribe(MessageType.SYSTEM_EVENT, callback2)
    
    # Publish a message
    await message_router.publish(test_message)
    
    # Check that both callbacks were called
    callback1.assert_called_once_with(test_message)
    callback2.assert_called_once_with(test_message)

@pytest.mark.asyncio
async def test_different_message_types(message_router):
    """Test that only handlers for the correct message type are called."""
    # Create mock callbacks
    system_callback = AsyncMock()
    sensor_callback = AsyncMock()
    
    # Subscribe callbacks to different message types
    message_router.subscribe(MessageType.SYSTEM_EVENT, system_callback)
    message_router.subscribe(MessageType.SENSOR_READING, sensor_callback)
    
    # Create a system event message
    system_message = Message(
        msg_type=MessageType.SYSTEM_EVENT,
        payload={"event": "test"},
        source="test"
    )
    
    # Publish the system message
    await message_router.publish(system_message)
    
    # Check that only the system callback was called
    system_callback.assert_called_once_with(system_message)
    sensor_callback.assert_not_called()

@pytest.mark.asyncio
async def test_broadcast_sensor_reading(message_router):
    """Test the broadcast_sensor_reading helper method."""
    # Create a mock callback
    callback = AsyncMock()
    message_router.subscribe(MessageType.SENSOR_READING, callback)
    
    # Broadcast a sensor reading
    message_router.broadcast_sensor_reading(
        sensor_type="temperature",
        sensor_id="sensor1",
        value=25.5,
        unit="°C",
        metadata={"location": "room1"}
    )
    
    # Check that the callback was called with the correct message
    callback.assert_called_once()
    message = callback.call_args[0][0]
    assert message.msg_type == MessageType.SENSOR_READING
    assert message.payload["sensor_type"] == "temperature"
    assert message.payload["sensor_id"] == "sensor1"
    assert message.payload["value"] == 25.5
    assert message.payload["unit"] == "°C"
    assert message.payload["metadata"]["location"] == "room1"
    assert message.source == "sensor"
