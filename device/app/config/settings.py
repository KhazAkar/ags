"""Application configuration settings."""
from __future__ import annotations

import os
from pathlib import Path
from typing import TypedDict

from dotenv import load_dotenv

# Load environment variables from .env file
status = load_dotenv()
if not status:
    raise ValueError("Failed to load environment variables from .env file")

# Base directory
BASE_DIR: Path = Path(__file__).parent.parent.parent

# MQTT Configuration
MQTT_BROKER: str = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT: int = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC_PREFIX: str = os.getenv("MQTT_TOPIC_PREFIX", "ags/")

# Database Configuration
DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/data/ags.db")

# Hardware Configuration
class GpioConfig(TypedDict):
    """GPIO configuration type definition."""
    water_pump: int
    light_relay: int
    fan_relay: int

GPIO_CONFIG: GpioConfig = {
    "water_pump": int(os.getenv("GPIO_WATER_PUMP", 17)),
    "light_relay": int(os.getenv("GPIO_LIGHT_RELAY", 27)),
    "fan_relay": int(os.getenv("GPIO_FAN_RELAY", 22)),
}

# Sensor Configuration
class SensorConfig(TypedDict, total=False):
    """Base sensor configuration type."""
    adc_channel: int
    wet_value: int
    dry_value: int
    device_folder: str
    device_prefix: str

SENSORS: dict[str, SensorConfig] = {
    "soil_moisture": {
        "adc_channel": int(os.getenv("SOIL_MOISTURE_ADC", 0)),
        "wet_value": int(os.getenv("SOIL_WET_VALUE", 25000)),
        "dry_value": int(os.getenv("SOIL_DRY_VALUE", 50000)),
    },
    "ds18b20": {
        "device_folder": "/sys/bus/w1/devices/",
        "device_prefix": "28-",
    },
}

# Application Settings
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
