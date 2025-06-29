"""Tests for temperature sensor functionality."""
import unittest
from unittest.mock import MagicMock, patch
from app.sensors.receivers.temperature import TemperatureSensorReceiver
from app.sensors.senders.temperature import TemperatureSensorSender
from app.data_model import SensorData

class TestTemperatureSensorReceiver(unittest.TestCase):
    """Test cases for TemperatureSensorReceiver."""

    def setUp(self):
        """Set up test fixtures."""
        self.mock_router = MagicMock()
        self.receiver = TemperatureSensorReceiver(self.mock_router)

    def test_initialization(self):
        """Test that the receiver subscribes to the correct topic."""
        self.mock_router.subscribe.assert_called_once_with(
            "sensor/temperature", self.receiver._handle_message
        )

    @patch('time.time', return_value=1234567890)
    def test_handle_message(self, mock_time):
        """Test handling of temperature messages."""
        test_data = {
            "temperature": SensorData(
                value=25.5,
                timestamp=1234567890,
                sensor="ds18b20_1"
            )
        }
        self.receiver._handle_message(test_data)
        # Add assertions based on expected behavior

class TestTemperatureSensorSender(unittest.TestCase):
    """Test cases for TemperatureSensorSender."""

    @patch('os.path.exists', return_value=True)
    @patch('builtins.open', create=True)
    @patch('time.sleep')
    def test_read_temperature_success(self, mock_sleep, mock_open, mock_exists):
        """Test successful temperature reading from DS18B20."""
        mock_file = MagicMock()
        mock_file.__enter__.return_value = mock_file
        mock_file.readline.return_value = "a1 01 4b 46 7f ff 0c 10 2c : crc=2c YES\n"
        mock_file.seek.return_value = 0
        mock_file.tell.return_value = 0
        mock_open.return_value = mock_file

        sender = TemperatureSensorSender(device_id="28-000000000001")
        result = sender.read()

        self.assertIsNotNone(result)
        self.assertEqual(result.value, 25.5)  # Expected value from the mock
        self.assertEqual(result.sensor, "ds18b20_1")

    @patch('os.path.exists', return_value=False)
    def test_read_temperature_device_not_found(self, mock_exists):
        """Test behavior when device is not found."""
        with self.assertRaises(FileNotFoundError):
            TemperatureSensorSender(device_id="nonexistent")

if __name__ == '__main__':
    unittest.main()
