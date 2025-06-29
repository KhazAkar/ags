from dataclasses import dataclass, asdict
from typing import Any


@dataclass
class SensorData:
    """Data model for sensor data.
    
    Attributes:
        value: The sensor reading value (int, float, or str)
        timestamp: Unix timestamp of when the reading was taken
        sensor: Identifier for the sensor
    """
    value: int| float| str
    timestamp: int
    sensor: str
    
    def to_dict(self) -> dict[str, Any]:
        """Convert the SensorData instance to a dictionary.
        
        Returns:
            A dictionary representation of the sensor data.
        """
        return asdict(self)
