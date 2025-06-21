"""
Message routing system for handling internal communication.
"""
from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import StrEnum, auto
from typing import Any, Callable, TypeVar

T = TypeVar('T')

class MessageType(StrEnum):
    """Enum representing different types of messages in the system."""
    SENSOR_READING = auto()
    DEVICE_CONTROL = auto()
    SYSTEM_EVENT = auto()
    PROFILE_UPDATE = auto()
    DEVICE_DATA = auto()
    DEVICE_MEASUREMENT = auto()
    DEVICE_ERROR = auto()

@dataclass
class Message:
    """Base message class for internal communication."""
    msg_type: MessageType
    payload: dict[str, Any]
    source: str = "system"
    timestamp: float | None = None

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
            message.timestamp = time.time()
        
        self.logger.debug(f"Publishing {message.msg_type} message: {message.payload}")
        
        # Call all handlers for this message type
        if message.msg_type in self.handlers:
            for handler in self.handlers[message.msg_type]:
                try:
                    handler(message)
                except Exception as e:
                    self.logger.error(f"Error in message handler: {e}", exc_info=True)
    
    def broadcast_device_data(self, device_data: dict[str, Any]) -> None:
        """Broadcast a full device data message.
        
        Args:
            device_data: Dictionary containing complete device data
            
        Raises:
            ValueError: If device_id is missing from device_data
        """
        # Ensure required fields are present
        device_id = device_data.get('device_id')
        if not device_id:
            raise ValueError("device_id is required in device_data")
            
        # Add timestamp if not present
        if 'timestamp' not in device_data:
            device_data['timestamp'] = datetime.now(timezone.utc).isoformat()
            
        message = Message(
            msg_type=MessageType.DEVICE_DATA,
            payload=device_data,
            source=f"device:{device_id}"
        )
        self.publish(message)
        
    def broadcast_measurement(
        self, 
        device_id: str, 
        measurement_type: str, 
        value: float, 
        unit: str | None = None, 
        timestamp: float | None = None
    ) -> None:
        """Broadcast a single measurement update.
        
        Args:
            device_id: ID of the device
            measurement_type: Type of measurement (e.g., 'temperature', 'humidity')
            value: Numeric value of the measurement
            unit: Unit of measurement (e.g., '°C', '%')
            timestamp: Optional timestamp in seconds since epoch
        """
        timestamp_iso = (
            datetime.now(timezone.utc).isoformat() 
            if timestamp is None 
            else datetime.fromtimestamp(timestamp, timezone.utc).isoformat()
        )
        
        payload = {
            'device_id': device_id,
            'type': measurement_type,
            'value': value,
            'unit': unit,
            'timestamp': timestamp_iso
        }
        
        message = Message(
            msg_type=MessageType.DEVICE_MEASUREMENT,
            payload=payload,
            source=f"device:{device_id}"
        )
        self.publish(message)

    def broadcast_error(self, device_id: str, error_code: str, message: Message, timestamp: str | None = None) -> None:
        """Broadcast a device error.
        
        Args:
            device_id: Unique identifier for the device
            error_code: Error code identifier
            message: Human-readable error message
            timestamp: Optional timestamp in ISO format (defaults to current time)
        """
        
        if not timestamp:
            timestamp = datetime.now(timezone.utc).isoformat()
            
        error_data = {
            'device_id': device_id,
            'code': error_code,
            'message': message,
            'timestamp': timestamp,
            'resolved': False
        }
        
        message = Message(
            msg_type=MessageType.DEVICE_ERROR,
            payload=error_data,
            source=f"device:{device_id}"
        )
        self.publish(message)
        
        # Also log the error
        self.logger.error(f"Device {device_id} error {error_code}: {message}")

    def broadcast_device_status(
        self, 
        device_id: str, 
        status: str, 
        location: str | None = None
    ) -> None:
        """Broadcast a device status update.
        
        Args:
            device_id: Unique identifier for the device
            status: New status (e.g., 'online', 'offline', 'maintenance')
            location: Optional location update
        """
        payload: dict[str, Any] = {
            'device_id': device_id,
            'status': status,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        if location is not None:
            payload['location'] = location
            
        message = Message(
            msg_type=MessageType.DEVICE_CONTROL,
            payload=payload,
            source=f"device:{device_id}"
        )
        self.publish(message)

    def broadcast_system_event(
        self, 
        event_type: str, 
        message: str, 
        data: dict[str, Any] | None = None
    ) -> None:
        """Broadcast a system event.
        
        Args:
            event_type: Type of system event
            message: Human-readable message
            data: Additional event data
        """
        msg = Message(
            msg_type=MessageType.SYSTEM_EVENT,
            payload={
                'event_type': event_type,
                'message': message,
                'data': data or {},
                'timestamp': datetime.now(timezone.utc).isoformat()
            },
            source='system'
        )
        self.publish(msg)

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
