#!/usr/bin/env python3
"""
Autonomous Gardening System - Main Application

This is the main entry point for the autonomous gardening system.
It initializes all components and starts the application.
"""
import asyncio
import logging
import signal
import sys
from pathlib import Path

import falcon
from falcon.asgi import App

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.absolute()))

from app.config.settings import LOG_LEVEL, ENVIRONMENT
from app.core.message_router import MessageRouter
from app.core.platform_handler import PlatformHandler
from app.services.mqtt_client import MQTTClient

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('ags.log')
    ]
)
logger = logging.getLogger(__name__)

class HealthCheck:
    """Simple health check endpoint."""
    async def on_get(self, req, resp):
        resp.media = {
            'status': 'ok',
            'service': 'autonomous-gardening-system',
            'version': '0.1.0',
            'environment': ENVIRONMENT
        }
        resp.content_type = 'application/json'
        resp.status = falcon.HTTP_200

class Application:
    """Main application class that orchestrates all components."""
    def __init__(self):
        self.running = False
        self.message_router = MessageRouter()
        self.platform = PlatformHandler(self.message_router)
        self.mqtt_client = MQTTClient(self.message_router)
        self.web_app = self._create_web_app()
        
    def _create_web_app(self) -> App:
        """Create and configure the Falcon web application."""
        app = App()
        
        # Add routes
        app.add_route('/health', HealthCheck())
        
        # TODO: Add more API routes here
        
        return app
    
    async def start(self):
        """Start the application."""
        if self.running:
            return
            
        logger.info("Starting Autonomous Gardening System...")
        
        try:
            # Initialize platform
            await self.platform.initialize()
            
            # Connect to MQTT broker
            await self.mqtt_client.connect()
            
            # Set up signal handlers
            loop = asyncio.get_running_loop()
            for sig in (signal.SIGINT, signal.SIGTERM):
                loop.add_signal_handler(
                    sig,
                    lambda s=sig: asyncio.create_task(self.shutdown(s))
                )
            
            self.running = True
            logger.info("Autonomous Gardening System started successfully")
            
            # Main loop
            while self.running:
                try:
                    # Read sensors periodically
                    await self.platform.read_sensors()
                    
                    # Sleep for a while before next iteration
                    await asyncio.sleep(5)
                    
                except asyncio.CancelledError:
                    logger.info("Main loop cancelled")
                    break
                except Exception as e:
                    logger.error(f"Error in main loop: {e}", exc_info=True)
                    await asyncio.sleep(5)  # Prevent tight loop on errors
                    
        except Exception as e:
            logger.critical(f"Failed to start application: {e}", exc_info=True)
            await self.shutdown()
    
    async def shutdown(self, signal=None):
        """Shut down the application gracefully."""
        if not self.running:
            return
            
        logger.info("Shutting down Autonomous Gardening System...")
        self.running = False
        
        try:
            # Disconnect from MQTT
            await self.mqtt_client.disconnect()
            
            # Clean up platform resources
            await self.platform.cleanup()
            
            logger.info("Shutdown complete")
            
            # Exit the application
            if signal:
                sys.exit(0)
                
        except Exception as e:
            logger.error(f"Error during shutdown: {e}", exc_info=True)
            sys.exit(1)

async def main():
    """Main entry point."""
    app = Application()
    await app.start()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Application terminated by user")
    except Exception as e:
        logger.critical(f"Application crashed: {e}", exc_info=True)
        sys.exit(1)
