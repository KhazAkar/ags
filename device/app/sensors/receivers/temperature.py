"""Receiver module for the temperature sensor."""
from app.data_model import SensorData
from app.message_router import MessageRouter

class TemperatureSensorReceiver:
    """Handles incoming messages for the temperature sensor."""

    def __init__(self, router: MessageRouter) -> None:
        """Initialize the TemperatureSensorReceiver with the given MessageRouter."""
        self._router = router
        self._router.subscribe("sensor/temperature", self._handle_message)

    def _handle_message(self, message: dict[str, SensorData]) -> None:
        """Handle incoming messages for the temperature sensor."""
        # Process the message and update the sensor's state
        temperature = message.get("temperature")
        if temperature is not None:
            print(f"Temperature sensor received: {temperature.value}°C")
            # Add code here to update the sensor's state or perform any other actions
