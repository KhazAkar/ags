"""Unit tests for the message router."""
import json
import time
import threading
from unittest.mock import MagicMock, patch
import pytest
from paho.mqtt.client import MQTTMessage

from app.message_router import MessageRouter
from app.data_model import SensorData


def test_publish_subscribe_roundtrip() -> None:
    """Test basic publish/subscribe functionality."""
    with patch('paho.mqtt.client.Client') as mock_client:
        router = MessageRouter("localhost", 1883, use_tls=False)
        received = []

        def handler(payload: dict) -> None:
            received.append(payload)

        router.subscribe("test/topic", handler)
        
        # Simulate MQTT message
        message = MQTTMessage()
        message.topic = b"test/topic"
        message.payload = json.dumps({"value": 42, "timestamp": 1234567890, "sensor": "test"}).encode()
        
        # Call the internal message handler directly
        router._on_message(None, None, message)
        
        assert len(received) == 1
        assert received[0]["value"] == 42
        assert received[0]["sensor"] == "test"


def test_sensor_data_serialization() -> None:
    """Test that SensorData objects are properly serialized."""
    with patch('paho.mqtt.client.Client') as mock_client:
        router = MessageRouter("localhost", 1883, use_tls=False)
        mock_publish = MagicMock()
        router._client.publish = mock_publish
        
        sensor_data = SensorData(value=25.5, timestamp=1234567890, sensor="temperature")
        router.publish("sensors/temperature", sensor_data)
        
        # Verify the message was published with proper JSON serialization
        args, kwargs = mock_publish.call_args
        assert args[0] == "sensors/temperature"
        payload = json.loads(args[1])
        assert payload["value"] == 25.5
        assert payload["sensor"] == "temperature"


def test_connection_retry() -> None:
    """Test that the router handles connection failures gracefully."""
    with patch('paho.mqtt.client.Client') as mock_client:
        # Make connect raise an exception on first call
        mock_instance = mock_client.return_value
        mock_instance.connect.side_effect = [ConnectionError(), None]
        
        router = MessageRouter("localhost", 1883, use_tls=False, max_retries=3)
        
        # Should have called connect twice (initial + retry)
        assert mock_instance.connect.call_count == 2


def test_thread_safety() -> None:
    """Test that the router is thread-safe."""
    with patch('paho.mqtt.client.Client'):
        router = MessageRouter("localhost", 1883, use_tls=False)
        results = []
        
        def worker(topic: str, value: int) -> None:
            def handler(payload: dict) -> None:
                results.append((topic, payload["value"]))
            
            router.subscribe(topic, handler)
            time.sleep(0.01)  # Yield to other threads
            router.publish(topic, {"value": value, "timestamp": 0, "sensor": "test"})
        
        # Start multiple threads
        threads = []
        for i in range(5):
            t = threading.Thread(target=worker, args=(f"topic/{i}", i))
            threads.append(t)
            t.start()
        
        # Wait for all threads to complete
        for t in threads:
            t.join()
        
        # Verify all messages were processed
        assert len(results) == 5
        assert sorted(results, key=lambda x: x[0]) == [(f"topic/{i}", i) for i in range(5)]


def test_context_manager() -> None:
    """Test that the router can be used as a context manager."""
    with patch('paho.mqtt.client.Client') as mock_client:
        mock_instance = mock_client.return_value
        
        with MessageRouter("localhost", 1883) as router:
            # Should be connected
            assert router._client.loop_start.called
            
            # Publish a message
            router.publish("test/topic", {"value": 42, "timestamp": 0, "sensor": "test"})
            
            # Should be published
            assert mock_instance.publish.called
        
        # Should be disconnected when exiting context
        assert mock_instance.loop_stop.called
        assert mock_instance.disconnect.called


def test_message_validation() -> None:
    """Test that invalid messages are rejected."""
    with patch('paho.mqtt.client.Client'):
        router = MessageRouter("localhost", 1883, use_tls=False)
        
        with pytest.raises(ValueError):
            # Missing required fields
            router.publish("test/topic", {"value": 42})
            
        with pytest.raises(ValueError):
            # Invalid type
            router.publish("test/topic", "not a dict")
