# Autonomous Gardening System

An intelligent gardening system for automated plant care using the LaFrite board from Libre Computer.

## Project Structure

```
.
├── app/                      # Main application package
│   ├── __init__.py
│   ├── api/                  # Web API endpoints
│   │   ├── __init__.py
│   │   └── endpoints.py
│   ├── config/               # Configuration management
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── core/                 # Core business logic
│   │   ├── __init__.py
│   │   ├── message_router.py
│   │   └── platform_handler.py
│   ├── db/                   # Database models and operations
│   │   ├── __init__.py
│   │   ├── models.py
│   │   └── crud.py
│   ├── hardware/             # Hardware interfaces
│   │   ├── __init__.py
│   │   ├── gpio_control.py
│   │   ├── i2c_interface.py
│   │   ├── one_wire.py
│   │   ├── serial_interface.py
│   │   └── adc_interface.py
│   └── services/             # Business services
│       ├── __init__.py
│       ├── edge_ai.py
│       ├── mqtt_client.py
│       └── profile_manager.py
├── tests/                    # Test files
├── static/                   # Frontend static files
│   ├── css/
│   ├── js/
│   └── html/
├── main.py                   # Application entry point
├── pyproject.toml            # Project metadata and dependencies
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   uv pip install -e .
   ```

2. Configure environment variables in `.env` file

3. Run the application:
   ```bash
   python main.py
   ```

## Dependencies

- Python 3.12+
- paho-mqtt
- falcon
- SQLAlchemy
- RPi.GPIO (or alternative for LaFrite board)
- smbus2
- ds18x20
- Adafruit libraries for sensors

## Hardware Requirements

- LaFrite board from Libre Computer
- Various sensors (1-Wire, I2C, ADC)
- Relays/GPIO controlled devices
- Power supply
