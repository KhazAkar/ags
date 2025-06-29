"""Module for AHT20 humidity and temperature sensor using I2C."""
import time
import smbus2
from typing import Optional, Tuple
from app.data_model import SensorData

class AHT20Sensor:
    """Driver for AHT20 temperature and humidity sensor."""
    
    # I2C address of the AHT20
    AHT20_I2C_ADDR = 0x38
    
    # Commands
    AHT20_INIT_CMD = 0xBE
    AHT20_MEASURE_CMD = 0xAC
    AHT20_RESET_CMD = 0xBA
    
    def __init__(self, bus_num: int = 1) -> None:
        """Initialize the AHT20 sensor.
        
        Args:
            bus_num: I2C bus number (default: 1 for Raspberry Pi)
        """
        self.bus = smbus2.SMBus(bus_num)
        self._initialize_sensor()
    
    def _write_command(self, command: int, data: Optional[list[int]] = None) -> None:
        """Write a command to the sensor.
        
        Args:
            command: Command byte to send
            data: Optional data bytes to send after the command
        """
        if data is None:
            data = []
        self.bus.write_i2c_block_data(self.AHT20_I2C_ADDR, command, data)
    
    def _read_bytes(self, num_bytes: int) -> list[int]:
        """Read bytes from the sensor.
        
        Args:
            num_bytes: Number of bytes to read
            
        Returns:
            List of bytes read
        """
        return self.bus.read_i2c_block_data(self.AHT20_I2C_ADDR, 0x00, num_bytes)
    
    def _initialize_sensor(self) -> None:
        """Initialize the AHT20 sensor."""
        # Send reset command
        self._write_command(self.AHT20_RESET_CMD)
        time.sleep(0.02)  # Wait for reset to complete
        
        # Initialize the sensor
        self._write_command(self.AHT20_INIT_CMD, [0x08, 0x00])
        time.sleep(0.01)  # Wait for calibration to complete
    
    def read_raw_data(self) -> Optional[Tuple[float, float]]:
        """Read raw humidity and temperature from the sensor.
        
        Returns:
            Tuple of (humidity, temperature) or None if reading failed
        """
        try:
            # Trigger measurement
            self._write_command(self.AHT20_MEASURE_CMD, [0x33, 0x00])
            
            # Wait for measurement to complete
            time.sleep(0.08)  # Typical conversion time is 80ms
            
            # Read 6 bytes of data
            data = self._read_bytes(6)
            
            # Check if data is valid
            if (data[0] & 0x68) != 0x08:  # Check status bits
                return None
                
            # Convert data to humidity and temperature
            raw_humidity = ((data[1] << 12) | (data[2] << 4) | (data[3] >> 4))
            humidity = (raw_humidity * 100) / 0x100000
            
            raw_temp = ((data[3] & 0x0F) << 16) | (data[4] << 8) | data[5]
            temperature = (raw_temp * 200.0 / 0x100000) - 50.0
            
            return humidity, temperature
            
        except (IOError, IndexError):
            return None


class HumiditySensorSender:
    """Handles reading humidity from AHT20 sensor."""
    
    def __init__(self, bus_num: int = 1) -> None:
        """Initialize the humidity sensor.
        
        Args:
            bus_num: I2C bus number (default: 1 for Raspberry Pi)
        """
        self.sensor = AHT20Sensor(bus_num)
    
    def read(self) -> Optional[SensorData]:
        """Read humidity from the sensor.
        
        Returns:
            SensorData object containing the humidity reading or None if reading failed
        """
        result = self.sensor.read_raw_data()
        if result is None:
            return None
            
        humidity, _ = result
        return SensorData(
            value=round(humidity, 2),
            timestamp=int(time.time()),
            sensor="aht20_humidity"
        )


class HumiditySensorReceiver:
    """Handles incoming messages for the humidity sensor."""

    def __init__(self, router):
        """Initialize the HumiditySensorReceiver with the given MessageRouter."""
        self._router = router
        self._router.subscribe("sensor/humidity", self._handle_message)

    def _handle_message(self, message: dict[str, SensorData]) -> None:
        """Handle incoming messages for the humidity sensor."""
        humidity = message.get("humidity")
        if humidity is not None:
            print(f"Humidity sensor received: {humidity.value}%")
