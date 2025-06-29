"""Humidity sensor receiver module for handling humidity sensor control messages.

This module provides functionality to receive and process control messages
for the humidity sensor, including configuration, calibration, and status requests.
"""

from __future__ import annotations

import logging
import time
from collections.abc import Mapping, MutableMapping
from typing import Final, Literal, TypedDict

from app.message_router import MessagePayload, MessageRouter

# Type definitions
ConfigValue = bool | float | int | str | None
ConfigDict = dict[str, ConfigValue]
ControlCommand = Literal["configure", "calibrate", "reset", "status"]

logger: Final[logging.Logger] = logging.getLogger(__name__)


class HumidityConfig(TypedDict, total=True):
    """Type definition for humidity sensor configuration."""
    sampling_interval: float
    calibration_offset: float
    enabled: bool
    min_value: float
    max_value: float

class HumiditySensorReceiver:
    """Handles incoming messages for the humidity sensor.
    
    This class subscribes to the humidity sensor's control topic and processes
    incoming messages for configuration, calibration, and status requests.
    """

    _message_router: MessageRouter
    _current_config: ConfigDict

    def __init__(self, message_router: MessageRouter) -> None:
        """Initialize the humidity sensor receiver.
        
        Args:
            message_router: The message router instance to use for communication
        """
        self._message_router = message_router
        self._current_config = {
            "sampling_interval": 60.0,  # seconds
            "calibration_offset": 0.0,  # percentage points
            "enabled": True,
            "min_value": 0.0,  # minimum expected humidity percentage
            "max_value": 100.0,  # maximum expected humidity percentage
        }
        
        # Subscribe to control topic
        self._message_router.subscribe("sensor/humidity/control", self._handle_control_message)
        self._message_router.subscribe("sensor/humidity/status/get", self._handle_status_request)
        
        logger.info("Humidity sensor receiver initialized")
    
    def _extract_params(self, params_dict: Mapping[object, object]) -> ConfigDict:
        """Extract and validate parameters from a dictionary.
        
        Args:
            params_dict: The raw parameters dictionary
            
        Returns:
            A validated ConfigDict with string keys and supported value types
            
        Note:
            Only bool, int, float, str, and None values are preserved.
            Other types are converted to strings.
        """
        result: ConfigDict = {}
        if not isinstance(params_dict, MutableMapping):
            logger.warning("Parameters must be a dictionary")
            return result
            
        # Process dictionary items with proper type checking
        for key, value in params_dict.items():
            key_str = str(key)
            if not key_str:  # Skip empty keys
                continue
                
            # Convert to supported types
            if value is None or isinstance(value, (bool, int, float)):
                result[key_str] = value
            else:
                # Convert to string for any other type
                result[key_str] = str(value)
                
        return result
        
    def _handle_control_message(self, message: MessagePayload) -> None:
        """Handle incoming control messages.
        
        Args:
            message: The received message payload, expected to be a dict with 'command' and 'params'
        """
        if not isinstance(message, dict):
            logger.warning("Received non-dict control message: %s", message)
            return
            
        try:
            # Extract and validate command
            command = message.get("command")
            if not command or not isinstance(command, str):
                logger.warning("Missing or invalid 'command' in message")
                return
                
            # Extract and validate parameters
            raw_params: Mapping[object, object] = {}
            params_value = message.get("params")
            if isinstance(params_value, MutableMapping):
                raw_params = params_value
            else:
                logger.warning("Invalid 'params' type, expected dict, got %s", 
                            type(params_value).__name__)
                
            # Extract parameters with type safety
            params = self._extract_params(raw_params)
                
            # Process the command
            if command == "configure":
                self._handle_configure(params)
            elif command == "calibrate":
                self._handle_calibrate(params)
            elif command == "reset":
                self._handle_reset()
            elif command == "status":
                self._publish_status()
            else:
                logger.warning("Unknown command: %s", command)
                
        except Exception as e:
            logger.error("Error processing control message: %s", e, exc_info=True)
    
    def _handle_configure(self, params: ConfigDict) -> None:
        """Handle configuration updates.
        
        Args:
            params: Configuration parameters to update
        """
        if not params:
            logger.warning("No configuration parameters provided")
            return
            
        logger.info("Updating configuration: %s", params)
        
        # Update configuration with new values
        for key, value in params.items():
            if not key or not isinstance(key, str):
                logger.warning("Skipping invalid config key: %s", key)
                continue
                
            if key not in self._current_config:
                logger.debug("Unknown config key: %s", key)
                continue
                
            self._update_config_value(key, value)
        
        # Publish updated configuration
        self._publish_status()
    
    def _handle_calibrate(self, params: ConfigDict) -> None:
        """Handle calibration command.
        
        Args:
            params: Calibration parameters (must contain 'offset' key)
        """
        if not params or 'offset' not in params:
            logger.warning("Missing 'offset' parameter in calibration command")
            return
            
        try:
            offset = params['offset']
            if offset is None:
                raise ValueError("Offset cannot be None")
                
            offset_value = float(offset)
            self._update_config_value('calibration_offset', offset_value)
            logger.info("Calibration offset updated to: %f", offset_value)
            self._publish_status()
        except (ValueError, TypeError) as e:
            logger.error("Invalid calibration offset: %s", e, exc_info=True)
    
    def _handle_reset(self) -> None:
        """Handle reset to default configuration."""
        self._current_config = {
            "sampling_interval": 60.0,
            "calibration_offset": 0.0,
            "enabled": True,
            "min_value": 0.0,  # Minimum valid humidity percentage
            "max_value": 100.0  # Maximum valid humidity percentage
        }
        logger.info("Reset to default configuration")
        self._publish_status()
    
    def _handle_status_request(self, _message: MessagePayload) -> None:
        """Handle status request.
        
        Args:
            _message: The status request message (ignored)
        """
        self._publish_status()
    
    def _publish_status(self) -> None:
        """Publish the current status to the status topic."""
        status = {
            "timestamp": time.time(),
            **{
                k: v for k, v in self._current_config.items()
                if isinstance(v, (bool, int, float, str))
            }
        }
        self._message_router.publish("sensor/humidity/status", status)
        logger.debug("Published status update")

    def _convert_value(
        self, 
        value: object, 
        target_type: type[bool] | type[float] | type[int] | type[str]
    ) -> ConfigValue:
        """Convert a value to the target type.

        Args:
            value: The value to convert (must be a supported type)
            target_type: The target type (bool, float, int, or str)

        Returns:
            The converted value of the target type, or None if value is None
            
        Raises:
            ValueError: If the value cannot be converted to the target type
        """
        if value is None:
            return None
            
        # Fast path for string conversion
        if target_type is str:
            return str(value)
            
        # Skip conversion if already the correct type (except for bool since bool is a subclass of int)
        if target_type is not bool and isinstance(value, target_type):
            return value
            
        try:
            # Convert to string first for consistent parsing
            str_value = str(value)
            
            if target_type is bool:
                return str_value.lower() in ('true', '1', 'yes', 'y', 't')
            if target_type is float:
                return float(str_value)
            if target_type is int:
                return int(float(str_value))
                
            return str_value
            
        except (ValueError, TypeError) as e:
            raise ValueError(
                f"Cannot convert {value!r} to {target_type.__name__}: {e}"
            ) from e
            
    def _update_config_value(self, key: str, value: ConfigValue) -> None:
        """Update a configuration value if it has changed.
        
        Args:
            key: The configuration key to update
            value: The new value (will be converted to the correct type)
        """
        if not key:
            logger.warning("Empty config key")
            return
            
        if key not in self._current_config:
            logger.warning("Unknown config key: %s", key)
            return
            
        current_value = self._current_config[key]
        
        try:
            # Convert value to the same type as current value
            if current_value is not None and value is not None:
                target_type = type(current_value)
                converted_value = self._convert_value(value, target_type)
            else:
                converted_value = value
                
            # Only update if value has changed
            if converted_value != current_value:
                self._current_config[key] = converted_value
                logger.info("Updated %s: %s -> %s", key, current_value, converted_value)
                
        except (ValueError, TypeError) as e:
            logger.error("Error updating config %s: %s", key, e, exc_info=True)
        
        # Publish updated configuration
        self._publish_status()
