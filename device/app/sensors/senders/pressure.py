"""Module for BMP280 pressure and temperature sensor using I2C."""
import time
import smbus2
from app.data_model import SensorData

class BMP280Sensor:
    """Driver for BMP280 pressure and temperature sensor."""
    
    # I2C address of the BMP280 (can be 0x76 or 0x77)
    BMP280_I2C_ADDR = 0x76  # or 0x77 depending on SDO pin
    
    # Registers
    REG_ID = 0xD0
    REG_RESET = 0xE0
    REG_CTRL_MEAS = 0xF4
    REG_CONFIG = 0xF5
    REG_PRESS_MSB = 0xF7
    
    # Calibration parameters registers
    REG_DIG_T1 = 0x88
    REG_DIG_P1 = 0x8E
    
    # Oversampling settings
    OSRS_OFF = 0x00
    OSRS_1 = 0x01
    OSRS_2 = 0x02
    OSRS_4 = 0x03
    OSRS_8 = 0x04
    OSRS_16 = 0x05
    
    # Power modes
    MODE_SLEEP = 0x00
    MODE_FORCED = 0x01
    MODE_NORMAL = 0x03
    
    def __init__(self, bus_num: int = 1, address: int = 0x76) -> None:
        """Initialize the BMP280 sensor.
        
        Args:
            bus_num: I2C bus number (default: 1 for Raspberry Pi)
            address: I2C address of the sensor (0x76 or 0x77)
        """
        self.address = address
        self.bus = smbus2.SMBus(bus_num)
        self.dig_T = [0] * 3
        self.dig_P = [0] * 9
        self._read_calibration()
        self._setup_sensor()
    
    def _read_byte(self, reg: int) -> int:
        """Read a single byte from the specified register."""
        return self.bus.read_byte_data(self.address, reg)
    
    def _read_word(self, reg: int) -> int:
        """Read a word (2 bytes) from the specified register."""
        return self.bus.read_word_data(self.address, reg)
    
    def _read_word_LE(self, reg: int) -> int:
        """Read a word in little-endian format from the specified register."""
        val = self._read_word(reg)
        return (val >> 8) | ((val & 0xFF) << 8)
    
    def _read_s16_LE(self, reg: int) -> int:
        """Read a signed 16-bit value in little-endian format."""
        val = self._read_word_LE(reg)
        return val if val < 0x8000 else val - 0x10000
    
    def _read_u16_LE(self, reg: int) -> int:
        """Read an unsigned 16-bit value in little-endian format."""
        return self._read_word_LE(reg)
    
    def _read_calibration(self) -> None:
        """Read and store the calibration parameters."""
        # Temperature calibration parameters
        self.dig_T[0] = self._read_u16_LE(self.REG_DIG_T1)
        self.dig_T[1] = self._read_s16_LE(self.REG_DIG_T1 + 2)
        self.dig_T[2] = self._read_s16_LE(self.REG_DIG_T1 + 4)
        
        # Pressure calibration parameters
        self.dig_P[0] = self._read_u16_LE(self.REG_DIG_P1)
        self.dig_P[1] = self._read_s16_LE(self.REG_DIG_P1 + 2)
        self.dig_P[2] = self._read_s16_LE(self.REG_DIG_P1 + 4)
        self.dig_P[3] = self._read_s16_LE(self.REG_DIG_P1 + 6)
        self.dig_P[4] = self._read_s16_LE(self.REG_DIG_P1 + 8)
        self.dig_P[5] = self._read_s16_LE(self.REG_DIG_P1 + 10)
        self.dig_P[6] = self._read_s16_LE(self.REG_DIG_P1 + 12)
        self.dig_P[7] = self._read_s16_LE(self.REG_DIG_P1 + 14)
        self.dig_P[8] = self._read_s16_LE(self.REG_DIG_P1 + 16)
    
    def _setup_sensor(self) -> None:
        """Configure the sensor with default settings."""
        # Set to sleep mode before configuring
        self.bus.write_byte_data(self.address, self.REG_CTRL_MEAS, 0x00)
        
        # Configure the sensor
        # t_sb = 0.5ms, filter = off, spi3w_en = off
        self.bus.write_byte_data(self.address, self.REG_CONFIG, 0x00)
        
        # ctrl_meas: osrs_t x1, osrs_p x1, normal mode
        self.bus.write_byte_data(
            self.address, 
            self.REG_CTRL_MEAS, 
            (self.OSRS_1 << 5) | (self.OSRS_1 << 2) | self.MODE_NORMAL
        )
    
    def read_raw_data(self) -> tuple[float, float] | None:
        """Read raw pressure and temperature from the sensor.
        
        Returns:
            Tuple of (pressure, temperature) in (hPa, °C) or None if reading failed
        """
        try:
            # Read temperature and pressure data
            data = self.bus.read_i2c_block_data(self.address, self.REG_PRESS_MSB, 6)
            
            # Convert pressure and temperature data to 20-bits
            adc_p = ((data[0] << 16) | (data[1] << 8) | data[2]) >> 4
            adc_t = ((data[3] << 16) | (data[4] << 8) | data[5]) >> 4
            
            # Calculate temperature in °C
            var1 = (((adc_t >> 3) - (self.dig_T[0] << 1)) * self.dig_T[1]) >> 11
            var2 = (((((adc_t >> 4) - self.dig_T[0]) * ((adc_t >> 4) - self.dig_T[0])) >> 12) * self.dig_T[2]) >> 14
            t_fine = var1 + var2
            temperature = (t_fine * 5 + 128) >> 8
            temperature = temperature / 100.0
            
            # Calculate pressure in hPa
            var1 = t_fine / 2.0 - 64000.0
            var2 = var1 * var1 * self.dig_P[5] / 32768.0
            var2 = var2 + var1 * self.dig_P[4] * 2.0
            var2 = var2 / 4.0 + self.dig_P[3] * 65536.0
            var1 = (self.dig_P[2] * var1 * var1 / 524288.0 + self.dig_P[1] * var1) / 524288.0
            var1 = (1.0 + var1 / 32768.0) * self.dig_P[0]
            
            if var1 == 0:
                return None  # Avoid division by zero
                
            pressure = 1048576.0 - adc_p
            pressure = (pressure - (var2 / 4096.0)) * 6250.0 / var1
            var1 = self.dig_P[8] * pressure * pressure / 2147483648.0
            var2 = pressure * self.dig_P[7] / 32768.0
            pressure = pressure + (var1 + var2 + self.dig_P[6]) / 16.0
            
            # Convert to hPa
            pressure = pressure / 100.0
            
            return pressure, temperature
            
        except (IOError, IndexError):
            return None


class PressureSensorSender:
    """Handles reading pressure from BMP280 sensor."""
    
    def __init__(self, bus_num: int = 1, address: int = 0x76) -> None:
        """Initialize the pressure sensor.
        
        Args:
            bus_num: I2C bus number (default: 1 for Raspberry Pi)
            address: I2C address of the sensor (0x76 or 0x77)
        """
        self.sensor = BMP280Sensor(bus_num, address)
    
    def read(self) -> SensorData | None:
        """Read pressure from the sensor.
        
        Returns:
            SensorData object containing the pressure reading or None if reading failed
        """
        result = self.sensor.read_raw_data()
        if result is None:
            return None
            
        pressure, _ = result
        return SensorData(
            value=round(pressure, 2),
            timestamp=int(time.time()),
            sensor="bmp280_pressure"
        )



