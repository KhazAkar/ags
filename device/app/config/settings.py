"""
Application configuration settings.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).parent.parent.parent

# MQTT Configuration
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC_PREFIX = os.getenv("MQTT_TOPIC_PREFIX", "ags/")

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/data/ags.db")

# Hardware Configuration
GPIO_CONFIG = {
    "water_pump": int(os.getenv("GPIO_WATER_PUMP", 17)),
    "light_relay": int(os.getenv("GPIO_LIGHT_RELAY", 27)),
    "fan_relay": int(os.getenv("GPIO_FAN_RELAY", 22)),
}

# Sensor Configuration
SENSORS = {
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
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
