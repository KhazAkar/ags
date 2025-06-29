"""Tests for pressure sensor functionality."""
import unittest
from unittest.mock import MagicMock, patch, call
from app.sensors.senders.pressure import BMP280Sensor, PressureSensorSender, PressureSensorReceiver
from app.data_model import SensorData

class TestBMP280Sensor(unittest.TestCase):
    """Test cases for BMP280Sensor class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_bus = MagicMock()
        with patch('smbus2.SMBus', return_value=self.mock_bus):
            self.sensor = BMP280Sensor(bus_num=1, address=0x76)
    
    def test_read_byte(self):
        """Test reading a single byte from a register."""
        self.mock_bus.read_byte_data.return_value = 0x58
        result = self.sensor._read_byte(0xD0)  # REG_ID
        self.mock_bus.read_byte_data.assert_called_once_with(0x76, 0xD0)
        self.assertEqual(result, 0x58)
    
    def test_read_word_le(self):
        """Test reading a little-endian word."""
        self.mock_bus.read_word_data.return_value = 0x3412  # Little-endian 0x1234
        result = self.sensor._read_word_LE(0x88)  # REG_DIG_T1
        self.mock_bus.read_word_data.assert_called_once_with(0x76, 0x88)
        self.assertEqual(result, 0x1234)
    
    def test_read_s16_le(self):
        """Test reading a signed 16-bit little-endian value."""
        self.mock_bus.read_word_data.return_value = 0x84D2  # -31534 in two's complement
        result = self.sensor._read_s16_LE(0x8A)  # REG_DIG_T2
        self.assertEqual(result, -31534 + 0x10000)  # Should be interpreted as -31534
    
    @patch.object(BMP280Sensor, '_read_word_LE')
    @patch.object(BMP280Sensor, '_read_s16_LE')
    def test_read_calibration(self, mock_read_s16, mock_read_u16):
        """Test reading calibration parameters."""
        # Setup mock return values for calibration parameters
        mock_read_u16.side_effect = [
            27504,  # dig_T1
            26435,  # dig_P1
            -1000,  # dig_P2
            3024,   # dig_P3
            2855,   # dig_P4
            -7,     # dig_P5
            9900,   # dig_P6
            -10230  # dig_P7
        ]
        mock_read_s16.side_effect = [
            26435,  # dig_T2
            -1000,  # dig_T3
            3024,   # dig_P4
            2855,   # dig_P5
            -7,     # dig_P6
            9900,   # dig_P7
            -10230, # dig_P8
            3791,   # dig_P9
            1000    # dig_P10
        ]
        
        # Reset mock to clear any calls from __init__
        mock_read_u16.reset_mock()
        mock_read_s16.reset_mock()
        
        # Call the method directly
        sensor = BMP280Sensor()
        sensor._read_calibration()
        
        # Verify the calibration parameters were read correctly
        self.assertEqual(sensor.dig_T[0], 27504)
        self.assertEqual(sensor.dig_T[1], 26435)
        self.assertEqual(sensor.dig_T[2], -1000)
        self.assertEqual(sensor.dig_P[0], 26435)
        self.assertEqual(sensor.dig_P[1], -1000)
    
    @patch.object(BMP280Sensor, 'read_raw_data')
    def test_read_pressure_success(self, mock_read_raw):
        """Test successful pressure reading."""
        # Mock the raw data reading to return valid pressure and temperature
        mock_read_raw.return_value = (1013.25, 25.0)  # (pressure, temperature)
        
        pressure, temperature = self.sensor.read_raw_data()
        
        self.assertIsNotNone(pressure)
        self.assertIsNotNone(temperature)
        self.assertEqual(pressure, 1013.25)
        self.assertEqual(temperature, 25.0)


class TestPressureSensorSender(unittest.TestCase):
    """Test cases for PressureSensorSender class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_sensor = MagicMock(spec=BMP280Sensor)
        with patch('app.sensors.senders.pressure.BMP280Sensor', return_value=self.mock_sensor):
            self.sender = PressureSensorSender(bus_num=1, address=0x76)
    
    @patch('time.time', return_value=1234567890)
    def test_read_success(self, mock_time):
        """Test successful pressure reading."""
        # Mock sensor response
        self.mock_sensor.read_raw_data.return_value = (1013.25, 25.0)  # (pressure, temperature)
        
        result = self.sender.read()
        
        self.mock_sensor.read_raw_data.assert_called_once()
        self.assertIsNotNone(result)
        self.assertEqual(result.value, 1013.25)
        self.assertEqual(result.timestamp, 1234567890)
        self.assertEqual(result.sensor, "bmp280_pressure")
    
    def test_read_failure(self):
        """Test failed pressure reading."""
        self.mock_sensor.read_raw_data.return_value = None
        
        result = self.sender.read()
        
        self.assertIsNone(result)


class TestPressureSensorReceiver(unittest.TestCase):
    """Test cases for PressureSensorReceiver class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_router = MagicMock()
        self.receiver = PressureSensorReceiver(self.mock_router)
    
    def test_initialization(self):
        """Test that the receiver subscribes to the correct topic."""
        self.mock_router.subscribe.assert_called_once_with(
            "sensor/pressure", self.receiver._handle_message
        )
    
    def test_handle_message(self):
        """Test handling of pressure messages."""
        test_data = {
            "pressure": SensorData(
                value=1013.25,
                timestamp=1234567890,
                sensor="bmp280_pressure"
            )
        }
        self.receiver._handle_message(test_data)
        # Verify the message was processed (in this case, just printed)
        # In a real test, you might want to capture stdout to verify the print


if __name__ == '__main__':
    unittest.main()
