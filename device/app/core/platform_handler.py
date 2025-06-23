"""
Platform handler for hardware abstraction and control.
"""
import logging
from typing import Any
from unittest.mock import MagicMock

import RPi.GPIO as GPIO
from w1thermsensor import W1ThermSensor

from ..config.settings import GPIO_CONFIG, SENSORS
from .message_router import Message, MessageRouter, MessageType

logger = logging.getLogger(__name__)

class PlatformHandler:
    """
    Handles hardware platform-specific operations and provides a consistent interface
    for the rest of the application.
    """
    def __init__(self, message_router: MessageRouter):
        self.message_router = message_router
        self.gpio_devices: dict[str, Any] = {}
        self.sensors: dict[str, Any] = {}
        self.initialized = False
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

        # Subscribe to relevant messages
        self.message_router.subscribe(MessageType.DEVICE_CONTROL, self._handle_device_control)
        self.message_router.subscribe(MessageType.PROFILE_UPDATE, self._handle_profile_update)

    async def initialize(self):
        """Initialize all hardware interfaces."""
        if self.initialized:
            return

        self.logger.info("Initializing hardware platform...")

        try:
            # Initialize GPIO
            await self._init_gpio()

            # Initialize sensors
            await self._init_sensors()

            self.initialized = True
            self.logger.info("Hardware platform initialized successfully")

            # Broadcast system ready event
            self.message_router.publish(Message(
                msg_type=MessageType.SYSTEM_EVENT,
                payload={"event": "platform_ready"},
                source="platform"
            ))

        except Exception as e:
            self.logger.error(f"Failed to initialize hardware platform: {e}", exc_info=True)
            raise

    async def _init_gpio(self):
        """Initialize GPIO interfaces."""
        try:
            # Try to import RPi.GPIO, fallback to a mock if not available
            try:
                self.GPIO = GPIO
                self.GPIO.setmode(GPIO.BCM)
                self.GPIO.setwarnings(False)
                self.logger.info("Using RPi.GPIO for GPIO control")
            except (ImportError, RuntimeError):
                self.GPIO = MagicMock()
                self.logger.warning("RPi.GPIO not available, using mock GPIO")

            # Initialize GPIO pins
            for device, pin in GPIO_CONFIG.items():
                self.GPIO.setup(pin, self.GPIO.OUT, initial=self.GPIO.LOW)
                self.gpio_devices[device] = {"pin": pin, "state": False}

        except Exception as e:
            self.logger.error(f"Failed to initialize GPIO: {e}")
            raise

    async def _init_sensors(self):
        """Initialize sensor interfaces."""
        self.logger.info("Initializing sensors...")

        # Initialize 1-Wire for DS18B20 temperature sensors
        if SENSORS.get("ds18b20"):
            await self._init_one_wire()

        # Initialize ADC for soil moisture
        if SENSORS.get("soil_moisture"):
            await self._init_adc()

        # Initialize I2C devices
        await self._init_i2c()

    async def _init_one_wire(self):
        """Initialize 1-Wire interface for DS18B20 temperature sensors."""
        try:
            self.ds18b20 = W1ThermSensor()
            self.logger.info("1-Wire interface initialized")
        except Exception as e:
            self.logger.error(f"Failed to initialize 1-Wire: {e}")
            self.ds18b20 = None

    async def _init_adc(self):
        """Initialize ADC for soil moisture sensor."""
        try:
            # This is a placeholder - actual implementation depends on the ADC hardware
            self.logger.info("ADC interface initialized")
        except Exception as e:
            self.logger.error(f"Failed to initialize ADC: {e}")

    async def _init_i2c(self):
        """Initialize I2C devices."""
        try:
            # This is a placeholder - actual implementation depends on the I2C devices
            self.logger.info("I2C interface initialized")
        except Exception as e:
            self.logger.error(f"Failed to initialize I2C: {e}")

    async def _handle_device_control(self, message: Message):
        """Handle device control messages."""
        try:
            device_type = message.payload.get("device_type")
            device_id = message.payload.get("device_id")
            command = message.payload.get("command")
            params = message.payload.get("params", {})

            self.logger.debug(f"Handling device control: {device_type}.{device_id} - {command}")

            if device_type == "gpio":
                await self._control_gpio(device_id, command, params)
            # Add other device types as needed

        except Exception as e:
            self.logger.error(f"Error handling device control: {e}", exc_info=True)

    async def _control_gpio(self, device_id: str, command: str, params: dict):
        """Control a GPIO device."""
        if device_id not in self.gpio_devices:
            self.logger.error(f"Unknown GPIO device: {device_id}")
            return

        pin = self.gpio_devices[device_id]["pin"]

        if command == "on":
            self.GPIO.output(pin, self.GPIO.HIGH)
            self.gpio_devices[device_id]["state"] = True
            self.logger.info(f"Turned on {device_id} (GPIO {pin})")
        elif command == "off":
            self.GPIO.output(pin, self.GPIO.LOW)
            self.gpio_devices[device_id]["state"] = False
            self.logger.info(f"Turned off {device_id} (GPIO {pin})")
        elif command == "toggle":
            current_state = self.gpio_devices[device_id]["state"]
            new_state = not current_state
            self.GPIO.output(pin, self.GPIO.HIGH if new_state else self.GPIO.LOW)
            self.gpio_devices[device_id]["state"] = new_state
            self.logger.info(f"Toggled {device_id} to {'on' if new_state else 'off'} (GPIO {pin})")

    async def _handle_profile_update(self, message: Message):
        """Handle profile update messages."""
        try:
            profile = message.payload.get("profile")
            self.logger.info(f"Updating platform with new profile: {profile.get('name')}")

            # Update any hardware settings based on the new profile
            # This is a placeholder - implement actual profile application logic

        except Exception as e:
            self.logger.error(f"Error handling profile update: {e}", exc_info=True)

    async def read_sensors(self):
        """Read all sensors and publish the readings."""
        if not self.initialized:
            self.logger.warning("Platform not initialized, cannot read sensors")
            return

        # Read 1-Wire temperature sensors
        if hasattr(self, 'ds18b20') and self.ds18b20:
            try:
                for sensor in self.ds18b20.get_available_sensors():
                    temp = sensor.get_temperature()
                    self.message_router.broadcast_sensor_reading(
                        sensor_type="temperature",
                        sensor_id=sensor.id,
                        value=temp,
                        unit="°C"
                    )
            except Exception as e:
                self.logger.error(f"Error reading temperature sensors: {e}")

        # Add other sensor readings as needed

    async def cleanup(self):
        """Clean up resources."""
        self.logger.info("Cleaning up platform resources...")

        # Turn off all GPIO devices
        for device, data in self.gpio_devices.items():
            if data["state"]:
                self.GPIO.output(data["pin"], self.GPIO.LOW)
                self.logger.info(f"Turned off {device} during cleanup")

        # Clean up GPIO
        if hasattr(self, 'GPIO') and hasattr(self.GPIO, 'cleanup'):
            self.GPIO.cleanup()

        self.initialized = False
        self.logger.info("Platform resources cleaned up")
