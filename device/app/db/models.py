"""
Database models for the autonomous gardening system.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import TypeAlias, TypedDict, override

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.orm.decl_api import DeclarativeBase


class Base(DeclarativeBase):
    pass


def now() -> datetime:
    return datetime.now(timezone.utc)


# SQLAlchemy type mapping for JSON columns
class LightSchedule(TypedDict):
    on_time: str
    off_time: str
    intensity: float | None

class WaterSchedule(TypedDict):
    interval_days: int
    duration_seconds: int
    start_time: str

JSONType: TypeAlias = dict[str, 'JSONType'] | list['JSONType'] | str | int | float | bool | None


class Device(Base):
    """Represents a physical device in the system."""
    __tablename__: str = 'devices'
    
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default='offline')
    last_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    
    # Relationships
    measurements: Mapped[list['DeviceMeasurement']] = relationship(
        'DeviceMeasurement', 
        back_populates='device', 
        cascade='all, delete-orphan'
    )
    errors: Mapped[list['DeviceError']] = relationship(
        'DeviceError', 
        back_populates='device', 
        cascade='all, delete-orphan'
    )


    @override
    def __repr__(self) -> str:
        return f"<Device(id={self.id!r}, name={self.name!r}, status={self.status!r})>"


class DeviceMeasurement(Base):
    """Stores measurement data from devices."""
    __tablename__: str = 'device_measurements'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    device_id: Mapped[str] = mapped_column(String, ForeignKey('devices.id', ondelete='CASCADE'))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    
    # Measurement fields
    temperature: Mapped[float | None] = mapped_column(Float, nullable=True)  # in Celsius
    humidity: Mapped[float | None] = mapped_column(Float, nullable=True)  # in %
    light: Mapped[float | None] = mapped_column(Float, nullable=True)  # in lux
    soil_moisture: Mapped[float | None] = mapped_column(Float, nullable=True)  # in %
    air_quality: Mapped[float | None] = mapped_column(Float, nullable=True)  # in AQI
    water_level: Mapped[float | None] = mapped_column(Float, nullable=True)  # in cm
    ph_level: Mapped[float | None] = mapped_column(Float, nullable=True)  # pH value
    
    # NPK values
    nitrogen: Mapped[float | None] = mapped_column(Float, nullable=True)  # in ppm
    phosphorus: Mapped[float | None] = mapped_column(Float, nullable=True)  # in ppm
    potassium: Mapped[float | None] = mapped_column(Float, nullable=True)  # in ppm
    
    # Relationships
    device: Mapped['Device'] = relationship('Device', back_populates='measurements')

    @override
    def __repr__(self) -> str:
        return f"<DeviceMeasurement(id={self.id!r}, device_id={self.device_id!r}, timestamp={self.timestamp!r})>"


class DeviceError(Base):
    """Tracks errors reported by devices."""
    __tablename__: str = 'device_errors'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    device_id: Mapped[str] = mapped_column(String, ForeignKey('devices.id', ondelete='CASCADE'))
    code: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str | None] = mapped_column(String, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    device: Mapped['Device'] = relationship('Device', back_populates='errors')

    @override
    def __repr__(self) -> str:
        return f"<DeviceError(id={self.id!r}, device_id={self.device_id!r}, code={self.code!r})>"
    
    def resolve(self) -> None:
        self.resolved = True
        self.resolved_at = now()


class PlantProfile(Base):
    """Configuration profile for different plant types."""
    __tablename__: str = "plant_profiles"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    min_temperature: Mapped[float] = mapped_column(Float)            # Minimum temperature in °C
    max_temperature: Mapped[float] = mapped_column(Float)            # Maximum temperature in °C
    min_humidity: Mapped[float] = mapped_column(Float)               # Minimum humidity in %
    max_humidity: Mapped[float] = mapped_column(Float)               # Maximum humidity in %
    min_soil_moisture: Mapped[float] = mapped_column(Float)          # Minimum soil moisture (0-100%)
    max_soil_moisture: Mapped[float] = mapped_column(Float)          # Maximum soil moisture (0-100%)
    light_hours: Mapped[LightSchedule] = mapped_column(JSON)         # Light schedule
    water_schedule: Mapped[WaterSchedule] = mapped_column(JSON)      # Watering schedule
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    
    @override
    def __repr__(self) -> str:
        return f"<PlantProfile(id={self.id!r}, name={self.name!r})>"
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now)
