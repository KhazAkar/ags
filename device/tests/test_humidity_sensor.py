"""Tests for humidity sensor functionality."""
import unittest
from unittest.mock import MagicMock, patch, call
from app.sensors.senders.humidity import AHT20Sensor, HumiditySensorSender, HumiditySensorReceiver
from app.data_model import SensorData

class TestAHT20Sensor(unittest.TestCase):
    """Test cases for AHT20Sensor class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_bus = MagicMock()
        self.sensor = AHT20Sensor(bus_num=1)
        self.sensor.bus = self.mock_bus
    
    def test_write_command(self):
        """Test writing a command to the sensor."""
        # Test with data
        self.sensor._write_command(0xAC, [0x33, 0x00])
        self.mock_bus.write_i2c_block_data.assert_called_once_with(0x38, 0xAC, [0x33, 0x00])
        
        # Test without data
        self.mock_bus.reset_mock()
        self.sensor._write_command(0xBE)
        self.mock_bus.write_i2c_block_data.assert_called_once_with(0x38, 0xBE, [])
    
    def test_read_bytes(self):
        """Test reading bytes from the sensor."""
        self.mock_bus.read_i2c_block_data.return_value = [0x08, 0x12, 0x34, 0x56, 0x78, 0x9A]
        result = self.sensor._read_bytes(6)
        self.mock_bus.read_i2c_block_data.assert_called_once_with(0x38, 0x00, 6)
        self.assertEqual(result, [0x08, 0x12, 0x34, 0x56, 0x78, 0x9A])
    
    @patch('time.sleep')
    def test_initialize_sensor(self, mock_sleep):
        """Test sensor initialization."""
        self.sensor._initialize_sensor()
        self.mock_bus.write_i2c_block_data.assert_has_calls([
            call(0x38, 0xBA, []),  # Reset command
            call(0x38, 0xBE, [0x08, 0x00])  # Init command
        ])
        mock_sleep.assert_has_calls([call(0.02), call(0.01)])
    
    @patch('time.sleep')
    def test_read_raw_data_success(self, mock_sleep):
        """Test successful raw data reading."""
        # Mock sensor response with valid data
        self.mock_bus.read_i2c_block_data.return_value = [
            0x08,  # Status OK
            0x12, 0x34, 0x56,  # Humidity data
            0x78, 0x9A, 0xBC   # Temperature data
        ]
        
        result = self.sensor.read_raw_data()
        
        self.mock_bus.write_i2c_block_data.assert_called_once_with(0x38, 0xAC, [0x33, 0x00])
        mock_sleep.assert_called_once_with(0.08)
        self.mock_bus.read_i2c_block_data.assert_called_once_with(0x38, 0x00, 6)
        self.assertIsNotNone(result)
        self.assertIsInstance(result, tuple)
        self.assertEqual(len(result), 2)


class TestHumiditySensorSender(unittest.TestCase):
    """Test cases for HumiditySensorSender class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_sensor = MagicMock(spec=AHT20Sensor)
        with patch('app.sensors.senders.humidity.AHT20Sensor', return_value=self.mock_sensor):
            self.sender = HumiditySensorSender(bus_num=1)
    
    def test_read_success(self):
        """Test successful humidity reading."""
        # Mock sensor response
        self.mock_sensor.read_raw_data.return_value = (45.67, 25.5)  # (humidity, temperature)
        
        result = self.sender.read()
        
        self.mock_sensor.read_raw_data.assert_called_once()
        self.assertIsNotNone(result)
        self.assertEqual(result.value, 45.67)
        self.assertEqual(result.sensor, "aht20_humidity")
    
    def test_read_failure(self):
        """Test failed humidity reading."""
        self.mock_sensor.read_raw_data.return_value = None
        
        result = self.sender.read()
        
        self.assertIsNone(result)


class TestHumiditySensorReceiver(unittest.TestCase):
    """Test cases for HumiditySensorReceiver class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_router = MagicMock()
        self.receiver = HumiditySensorReceiver(self.mock_router)
    
    def test_initialization(self):
        """Test that the receiver subscribes to the correct topic."""
        self.mock_router.subscribe.assert_called_once_with(
            "sensor/humidity", self.receiver._handle_message
        )
    
    def test_handle_message(self):
        """Test handling of humidity messages."""
        test_data = {
            "humidity": SensorData(
                value=45.67,
                timestamp=1234567890,
                sensor="aht20_humidity"
            )
        }
        self.receiver._handle_message(test_data)
        # Verify the message was processed (in this case, just printed)
        # In a real test, you might want to capture stdout to verify the print


if __name__ == '__main__':
    unittest.main()
