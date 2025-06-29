"""Module for DS18B20 temperature sensor using 1-Wire protocol."""
import os
import time
from dataclasses import dataclass
from app.data_model import SensorData

class TemperatureSensorSender:
    """Handles reading temperature from DS18B20 1-Wire temperature sensor."""
    
    BASE_DIR = "/sys/bus/w1/devices/"
    DEVICE_FILE = "/w1_slave"
    
    def __init__(self, device_id: str) -> None:
        """Initialize the DS18B20 temperature sensor.
        
        Args:
            device_id: The unique ID of the DS18B20 sensor (e.g., '28-000000000001')
        """
        self.device_id = device_id
        self.device_file = os.path.join(self.BASE_DIR, self.device_id, self.DEVICE_FILE)
        
        if not os.path.exists(self.device_file):
            raise FileNotFoundError(f"DS18B20 device {device_id} not found at {self.device_file}")
    
    def read_raw(self) -> str | None:
        """Read the raw temperature data from the sensor.
        
        Returns:
            Raw string data from the sensor or None if reading failed
        """
        try:
            with open(self.device_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                if lines[0].strip()[-3:] == 'YES':
                    return lines[1].split('t=')[-1].strip()
        except (IOError, IndexError):
            pass
        return None
    
    def read(self) -> SensorData | None:
        """Read and parse the temperature from the sensor.
        
        Returns:
            SensorData object containing the temperature reading or None if reading failed
        """
        raw_temp = self.read_raw()
        if raw_temp is None:
            return None
            
        try:
            # Convert raw value to degrees Celsius
            temp_c = float(raw_temp) / 1000.0
            return SensorData(
                value=round(temp_c, 2),
                timestamp=int(time.time()),
                sensor=f"ds18b20_{self.device_id}"
            )
        except (ValueError, TypeError):
            return None
