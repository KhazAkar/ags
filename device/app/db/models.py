"""
Database models for the autonomous gardening system.
"""
from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    sensor_type = Column(String, index=True)  # e.g., 'temperature', 'humidity', 'soil_moisture'
    sensor_id = Column(String, index=True)    # Unique identifier for the sensor
    value = Column(Float)                     # The actual reading
    unit = Column(String)                     # Unit of measurement
    timestamp = Column(DateTime, default=datetime.now(datetime.timezone.utc))
    metadata = Column(JSON, nullable=True)    # Additional sensor metadata

class DeviceState(Base):
    __tablename__ = "device_states"
    
    id = Column(Integer, primary_key=True, index=True)
    device_type = Column(String, index=True)  # e.g., 'water_pump', 'light', 'fan'
    device_id = Column(String, index=True)     # Unique identifier for the device
    state = Column(Boolean, default=False)     # Current state (on/off)
    last_updated = Column(DateTime, default=datetime.now(datetime.timezone.utc), onupdate=datetime.now(datetime.timezone.utc))
    metadata = Column(JSON, nullable=True)    # Additional device metadata

class PlantProfile(Base):
    __tablename__ = "plant_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    min_temperature = Column(Float)            # Minimum temperature in °C
    max_temperature = Column(Float)            # Maximum temperature in °C
    min_humidity = Column(Float)               # Minimum humidity in %
    max_humidity = Column(Float)               # Maximum humidity in %
    min_soil_moisture = Column(Float)          # Minimum soil moisture (0-100%)
    max_soil_moisture = Column(Float)          # Maximum soil moisture (0-100%)
    light_hours = Column(JSON)                 # Light schedule
    water_schedule = Column(JSON)              # Watering schedule
    created_at = Column(DateTime, default=datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(datetime.timezone.utc), onupdate=datetime.now(datetime.timezone.utc))
