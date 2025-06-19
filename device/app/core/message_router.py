"""
Message routing system for handling internal communication.
"""
import json
import logging
from typing import Callable, Any
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class MessageType(Enum):
    SENSOR_READING = "sensor_reading"
    DEVICE_CONTROL = "device_control"
    SYSTEM_EVENT = "system_event"
    PROFILE_UPDATE = "profile_update"

@dataclass
class Message:
    """Base message class for internal communication."""
    msg_type: MessageType
    payload: dict[str, Any]
    source: str = "system"
    timestamp: float = None

class MessageRouter:
    """
    Handles routing of internal messages between components.
    """
    def __init__(self):
        self.handlers: dict[MessageType, list[Callable[[Message], None]]] = {}
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    def subscribe(self, msg_type: MessageType, callback: Callable[[Message], None]):
        """Register a callback for a specific message type."""
        if msg_type not in self.handlers:
            self.handlers[msg_type] = []
        self.handlers[msg_type].append(callback)
        self.logger.debug(f"Subscribed callback to {msg_type}")
    
    def publish(self, message: Message):
        """Publish a message to all subscribed handlers."""
        if not message.timestamp:
            import time
            message.timestamp = time.time()
        
        self.logger.debug(f"Publishing {message.msg_type} message: {message.payload}")
        
        # Call all handlers for this message type
        if message.msg_type in self.handlers:
            for handler in self.handlers[message.msg_type]:
                try:
                    handler(message)
                except Exception as e:
                    self.logger.error(f"Error in message handler: {e}", exc_info=True)
    
    def broadcast_sensor_reading(self, sensor_type: str, sensor_id: str, value: float, unit: str, metadata: dict[str, Any] | None = None):
        """Helper method to broadcast sensor readings."""
        message = Message(
            msg_type=MessageType.SENSOR_READING,
            payload={
                "sensor_type": sensor_type,
                "sensor_id": sensor_id,
                "value": value,
                "unit": unit,
                "metadata": metadata or {}
            },
            source="sensor"
        )
        self.publish(message)
    
    def send_device_control(self, device_type: str, device_id: str, command: str, params: dict[str, Any] | None = None):
        """Helper method to send device control commands."""
        message = Message(
            msg_type=MessageType.DEVICE_CONTROL,
            payload={
                "device_type": device_type,
                "device_id": device_id,
                "command": command,
                "params": params or {}
            },
            source="controller"
        )
        self.publish(message)
