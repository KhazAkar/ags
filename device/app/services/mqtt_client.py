"""
MQTT client for communication with the MQTT broker.
"""
import json
import logging
import paho.mqtt.client as mqtt
from typing import Callable, Any
from dataclasses import dataclass
from ..config.settings import MQTT_BROKER, MQTT_PORT, MQTT_TOPIC_PREFIX
from ..core.message_router import Message, MessageType, MessageRouter

logger = logging.getLogger(__name__)

@dataclass
class MQTTMessage:
    """MQTT message container."""
    topic: str
    payload: dict[str, Any]
    qos: int = 0
    retain: bool = False

class MQTTClient:
    """
    MQTT client for publishing and subscribing to MQTT topics.
    Handles reconnection and message routing.
    """
    def __init__(self, message_router: MessageRouter):
        self.message_router = message_router
        self.client = mqtt.Client()
        self.connected = False
        self.subscriptions: dict[str, Callable[[dict[str, Any]], None]] = {}
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
        
        # Configure MQTT client
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        
        # Subscribe to internal messages to forward to MQTT
        self.message_router.subscribe(MessageType.SENSOR_READING, self._forward_sensor_reading)
        self.message_router.subscribe(MessageType.DEVICE_CONTROL, self._forward_device_control)
        self.message_router.subscribe(MessageType.SYSTEM_EVENT, self._forward_system_event)
    
    async def connect(self):
        """Connect to the MQTT broker."""
        if self.connected:
            return
            
        self.logger.info(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}")
        
        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
            self.connected = True
            self.logger.info("Connected to MQTT broker")
            
            # Resubscribe to topics if reconnecting
            for topic in self.subscriptions.keys():
                self._subscribe_internal(topic)
                
        except Exception as e:
            self.logger.error(f"Failed to connect to MQTT broker: {e}")
            raise
    
    def _on_connect(self, client, userdata, flags, rc):
        """Handle MQTT connection established."""
        if rc == 0:
            self.connected = True
            self.logger.info("MQTT connection established")
            
            # Resubscribe to topics
            for topic in self.subscriptions.keys():
                self._subscribe_internal(topic)
        else:
            self.connected = False
            self.logger.error(f"Failed to connect to MQTT broker with result code {rc}")
    
    def _on_disconnect(self, client, userdata, rc):
        """Handle MQTT disconnection."""
        self.connected = False
        if rc != 0:
            self.logger.warning(f"Unexpected MQTT disconnection. Will attempt to reconnect. RC: {rc}")
        else:
            self.logger.info("Disconnected from MQTT broker")
    
    def _on_message(self, client, userdata, msg):
        """Handle incoming MQTT messages."""
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode('utf-8'))
            
            self.logger.debug(f"Received MQTT message on {topic}: {payload}")
            
            # Check if we have a direct subscription for this topic
            if topic in self.subscriptions:
                try:
                    self.subscriptions[topic](payload)
                except Exception as e:
                    self.logger.error(f"Error in MQTT subscription handler for {topic}: {e}", exc_info=True)
            
            # Route the message to the appropriate handler based on topic
            self._route_mqtt_message(topic, payload)
            
        except json.JSONDecodeError:
            self.logger.error(f"Received invalid JSON on topic {msg.topic}")
        except Exception as e:
            self.logger.error(f"Error processing MQTT message: {e}", exc_info=True)
    
    def _route_mqtt_message(self, topic: str, payload: dict[str, Any]):
        """Route incoming MQTT messages to the appropriate handlers."""
        try:
            # Remove the topic prefix if present
            if topic.startswith(MQTT_TOPIC_PREFIX):
                topic = topic[len(MQTT_TOPIC_PREFIX):]
            
            # Split topic into components
            parts = topic.split('/')
            
            if len(parts) < 2:
                self.logger.warning(f"Invalid topic format: {topic}")
                return
            
            # Route based on topic structure
            if parts[0] == "control":
                # Format: <prefix>/control/<device_type>/<device_id>/<command>
                if len(parts) >= 4:
                    device_type = parts[1]
                    device_id = parts[2]
                    command = parts[3] if len(parts) > 3 else ""
                    
                    self.message_router.publish(Message(
                        msg_type=MessageType.DEVICE_CONTROL,
                        payload={
                            "device_type": device_type,
                            "device_id": device_id,
                            "command": command,
                            "params": payload
                        },
                        source="mqtt"
                    ))
            
            elif parts[0] == "config":
                # Format: <prefix>/config/<config_type>/<action>
                if len(parts) >= 3:
                    config_type = parts[1]
                    action = parts[2] if len(parts) > 2 else ""
                    
                    if config_type == "profile" and action == "update":
                        self.message_router.publish(Message(
                            msg_type=MessageType.PROFILE_UPDATE,
                            payload={"profile": payload},
                            source="mqtt"
                        ))
            
        except Exception as e:
            self.logger.error(f"Error routing MQTT message: {e}", exc_info=True)
    
    def subscribe(self, topic: str, callback: Callable[[dict[str, Any]], None]):
        """Subscribe to an MQTT topic."""
        full_topic = f"{MQTT_TOPIC_PREFIX}{topic}"
        self.subscriptions[full_topic] = callback
        
        if self.connected:
            self._subscribe_internal(full_topic)
    
    def _subscribe_internal(self, topic: str):
        """Internal method to subscribe to a topic."""
        self.client.subscribe(topic)
        self.logger.debug(f"Subscribed to MQTT topic: {topic}")
    
    def publish(self, message: MQTTMessage):
        """Publish a message to an MQTT topic."""
        if not self.connected:
            self.logger.warning("MQTT client not connected, message not published")
            return False
            
        try:
            # Add prefix if not already present
            if not message.topic.startswith(MQTT_TOPIC_PREFIX):
                message.topic = f"{MQTT_TOPIC_PREFIX}{message.topic}"
            
            payload = json.dumps(message.payload)
            result = self.client.publish(
                message.topic,
                payload=payload,
                qos=message.qos,
                retain=message.retain
            )
            
            if result.rc != mqtt.MQTT_ERR_SUCCESS:
                self.logger.error(f"Failed to publish MQTT message: {result.rc}")
                return False
                
            self.logger.debug(f"Published MQTT message to {message.topic}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error publishing MQTT message: {e}", exc_info=True)
            return False
    
    async def disconnect(self):
        """Disconnect from the MQTT broker."""
        if not self.connected:
            return
            
        self.logger.info("Disconnecting from MQTT broker...")
        self.client.loop_stop()
        self.client.disconnect()
        self.connected = False
    
    # Message forwarding methods
    def _forward_sensor_reading(self, message: Message):
        """Forward sensor readings to MQTT."""
        if not self.connected:
            return
            
        payload = message.payload
        sensor_type = payload.get("sensor_type")
        sensor_id = payload.get("sensor_id")
        
        if not sensor_type or not sensor_id:
            return
            
        topic = f"sensors/{sensor_type}/{sensor_id}"
        
        mqtt_message = MQTTMessage(
            topic=topic,
            payload=payload,
            qos=1,
            retain=True
        )
        
        self.publish(mqtt_message)
    
    def _forward_device_control(self, message: Message):
        """Forward device control messages to MQTT."""
        if not self.connected or message.source == "mqtt":
            # Don't echo back MQTT-originated messages
            return
            
        payload = message.payload
        device_type = payload.get("device_type")
        device_id = payload.get("device_id")
        command = payload.get("command")
        
        if not all([device_type, device_id, command]):
            return
            
        topic = f"status/{device_type}/{device_id}/{command}"
        
        mqtt_message = MQTTMessage(
            topic=topic,
            payload=payload,
            qos=1,
            retain=True
        )
        
        self.publish(mqtt_message)
    
    def _forward_system_event(self, message: Message):
        """Forward system events to MQTT."""
        if not self.connected:
            return
            
        payload = message.payload
        event = payload.get("event", "")
        
        if not event:
            return
            
        topic = f"system/events/{event}"
        
        mqtt_message = MQTTMessage(
            topic=topic,
            payload=payload,
            qos=1,
            retain=False
        )
        
        self.publish(mqtt_message)
