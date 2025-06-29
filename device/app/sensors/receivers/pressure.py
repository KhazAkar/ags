from app.data_model import SensorData
from app.message_router import MessageRouter

class PressureSensorReceiver:
    """Handles incoming messages for the pressure sensor."""

    def __init__(self, router: MessageRouter) -> None:
        """Initialize the PressureSensorReceiver with the given MessageRouter."""
        self._router = router
        self._router.subscribe("sensor/pressure", self._handle_message)

    def _handle_message(self, message: SensorData) -> None:
        """Handle incoming messages for the pressure sensor."""
        print(f"Pressure sensor received: {message.value} hPa")