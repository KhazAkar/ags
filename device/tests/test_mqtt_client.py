"""Tests for the MQTT client component."""
import asyncio
import json
from unittest.mock import AsyncMock, MagicMock, patch
import pytest

from app.services.mqtt_client import MQTTClient, MQTTMessage
from app.core.message_router import Message, MessageType

@pytest.fixture
def mqtt_client(message_router):
    """Create an MQTT client for testing."""
    client = MQTTClient(message_router)
    # Mock the MQTT client
    client.client = MagicMock()
    client.connected = True
    return client

@pytest.mark.asyncio
async def test_connect(mqtt_client):
    """Test connecting to the MQTT broker."""
    # Reset the mock
    mqtt_client.client.reset_mock()
    mqtt_client.connected = False
    
    # Mock the connect method
    mqtt_client.client.connect.return_value = 0
    
    # Connect
    await mqtt_client.connect()
    
    # Check that connect was called
    mqtt_client.client.connect.assert_called_once_with("localhost", 1883, 60)
    assert mqtt_client.client.loop_start.called
    
    # Check that we're connected
    assert mqtt_client.connected

@pytest.mark.asyncio
async def test_subscribe(mqtt_client):
    """Test subscribing to an MQTT topic."""
    # Create a mock callback
    callback = MagicMock()
    
    # Subscribe to a topic
    mqtt_client.subscribe("test/topic", callback)
    
    # Check that the subscription was recorded
    assert "ags/test/topic" in mqtt_client.subscriptions
    assert mqtt_client.subscriptions["ags/test/topic"] == callback
    
    # Check that subscribe was called on the MQTT client
    mqtt_client.client.subscribe.assert_called_once_with("ags/test/topic")

@pytest.mark.asyncio
async def test_publish(mqtt_client):
    """Test publishing an MQTT message."""
    # Create a test message
    message = MQTTMessage(
        topic="test/topic",
        payload={"key": "value"},
        qos=1,
        retain=True
    )
    
    # Mock the publish method
    mqtt_client.client.publish.return_value.rc = 0
    
    # Publish the message
    result = mqtt_client.publish(message)
    
    # Check that publish was called with the correct arguments
    mqtt_client.client.publish.assert_called_once_with(
        "ags/test/topic",
        payload=json.dumps({"key": "value"}),
        qos=1,
        retain=True
    )
    
    # Check that the result is True (success)
    assert result is True

@pytest.mark.asyncio
async def test_on_message(mqtt_client, message_router):
    """Test handling an incoming MQTT message."""
    # Create a mock MQTT message
    mqtt_msg = MagicMock()
    mqtt_msg.topic = "ags/control/light/1/on"
    mqtt_msg.payload = json.dumps({"brightness": 100}).encode('utf-8')
    
    # Mock the message router's publish method
    message_router.publish = AsyncMock()
    
    # Call the on_message handler
    mqtt_client._on_message(None, None, mqtt_msg)
    
    # Check that the message was routed correctly
    message_router.publish.assert_called_once()
    
    # Get the published message
    published_msg = message_router.publish.call_args[0][0]
    
    # Check the message contents
    assert published_msg.msg_type == MessageType.DEVICE_CONTROL
    assert published_msg.payload == {
        "device_type": "light",
        "device_id": "1",
        "command": "on",
        "params": {"brightness": 100}
    }
    assert published_msg.source == "mqtt"

@pytest.mark.asyncio
async def test_forward_sensor_reading(mqtt_client, message_router):
    """Test forwarding a sensor reading to MQTT."""
    # Reset the mock
    mqtt_client.client.publish.reset_mock()
    
    # Create a sensor reading message
    message = Message(
        msg_type=MessageType.SENSOR_READING,
        payload={
            "sensor_type": "temperature",
            "sensor_id": "sensor1",
            "value": 25.5,
            "unit": "°C",
            "metadata": {"location": "room1"}
        },
        source="sensor"
    )
    
    # Mock the publish method
    mqtt_client.publish = MagicMock(return_value=True)
    
    # Forward the sensor reading
    mqtt_client._forward_sensor_reading(message)
    
    # Check that publish was called with the correct arguments
    assert mqtt_client.publish.called
    mqtt_msg = mqtt_client.publish.call_args[0][0]
    
    assert mqtt_msg.topic == "sensors/temperature/sensor1"
    assert mqtt_msg.payload == {
        "sensor_type": "temperature",
        "sensor_id": "sensor1",
        "value": 25.5,
        "unit": "°C",
        "metadata": {"location": "room1"}
    }
    assert mqtt_msg.qos == 1
    assert mqtt_msg.retain is True
