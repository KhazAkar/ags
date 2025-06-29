"""Light-weight, in-memory message router using MQTT for communication.

This module provides a thread-safe publish/subscribe message router that uses MQTT
as the underlying transport protocol. It's designed for use in the autonomous
gardening system to facilitate communication between different components.

The router supports:
- Publish/subscribe messaging pattern
- Thread-safe operations
- Automatic reconnection
- Local message queuing when disconnected
- Support for different message types (dict, SensorData, str, bytes)
- QoS levels and retained messages
"""

from __future__ import annotations

import json
import logging
import threading
from collections import deque
from collections.abc import Callable
from dataclasses import asdict
from types import TracebackType
from typing import TypeAlias, TypeVar, cast, final

import paho.mqtt.client as mqtt
from paho.mqtt.client import MQTTMessage
from paho.mqtt.properties import Properties
from paho.mqtt.reasoncodes import ReasonCode

from .data_model import SensorData

# Type aliases for better code readability and type checking
T = TypeVar('T')

# Type alias for message payloads that can be published
MessagePayload: TypeAlias = (
    bytes | str | dict[str, object] | list[object] | int | float | None | SensorData
)
"""Type alias for message payloads that can be published.

Can be one of:
- bytes: Raw binary data
- str: A string message
- dict: A JSON-serializable dictionary
- list: A JSON-serializable list
- int/float: Numeric values
- None: Empty payload
- SensorData: A dataclass for sensor readings
"""

# Type alias for message handler functions
MessageHandler: TypeAlias = Callable[[MessagePayload], None]
"""Type alias for message handler functions.

Handlers will be called with the received message payload when a message
is received on a topic they are subscribed to. The payload will already
be deserialized if it was sent as JSON.
"""

# Type alias for the subscribers dictionary
SubscribersDict: TypeAlias = dict[str, list[MessageHandler]]
"""Type alias for the subscribers dictionary.

Maps topic names to lists of handler functions that should be called
when a message is received on that topic.
"""

# Type alias for the local message queue
MessageQueue: TypeAlias = deque[tuple[str, bytes, int, bool]]
"""Type alias for the local message queue.

Stores tuples of (topic, message, qos, retain) for messages that couldn't be sent
immediately (e.g., when disconnected from the broker).
"""

# MQTT connection constants
DEFAULT_PORT = 1883
DEFAULT_KEEPALIVE = 60
DEFAULT_QOS = 0
DEFAULT_RETAIN = False
DEFAULT_MAX_RETRIES = 3
DEFAULT_RECONNECT_DELAY = 5.0


@final
class MessageRouter:
    """A thread-safe publish/subscribe router using MQTT for communication.
    
    This class provides a high-level interface for MQTT-based messaging with:
    - Thread-safe operations
    - Automatic reconnection
    - Local message queuing when disconnected
    - Support for different message types
    - QoS and retained message support
    
    Example:
        ```python
        # Create a message router
        router = MessageRouter("mqtt.example.com")
        
        # Subscribe to a topic
        def handle_message(payload):
            print(f"Received: {payload}")
            
        router.subscribe("sensors/temperature", handle_message)
        
        # Publish a message
        router.publish("sensors/temperature", {"value": 25.5, "unit": "C"})
        
        # Use as context manager
        with MessageRouter("mqtt.example.com") as router:
            router.publish("test", "Hello, MQTT!")
        ```
    """

    # Type hints for instance variables
    _broker_url: str
    _broker_port: int
    _use_tls: bool
    _max_retries: int
    _reconnect_delay: float
    _lock: threading.RLock
    _connected: threading.Event
    _shutdown: threading.Event
    _client: mqtt.Client
    _subscribers: SubscribersDict
    _local_queue: MessageQueue
    _warned_topics: set[str]
    _connection_error: str | None

    def __init__(
        self,
        broker_url: str,
        broker_port: int = DEFAULT_PORT,
        *,
        client_id: str | None = None,
        clean_session: bool | None = None,
        protocol: int = mqtt.MQTTv311,
        transport: str = "tcp",
        max_retries: int = DEFAULT_MAX_RETRIES,
        reconnect_delay: float = DEFAULT_RECONNECT_DELAY,
        use_tls: bool = False,
    ) -> None:
        """Initialize the MQTT message router.
        
        Args:
            broker_url: MQTT broker URL
            broker_port: MQTT broker port
            client_id: Client ID for this connection
            clean_session: Whether to start a clean session
            protocol: MQTT protocol version (e.g., mqtt.MQTTv311)
            transport: Network transport to use ('tcp', 'websockets', 'unix')
            max_retries: Maximum number of reconnection attempts.
            reconnect_delay: Delay in seconds between retries.
            use_tls: Whether to use TLS for a secure connection.
        """
        # Validate inputs
        if not broker_url:
            raise ValueError("broker_url cannot be empty")
        if max_retries < 0:
            raise ValueError("max_retries cannot be negative")
        if transport not in ("tcp", "websockets", "unix"):
            raise ValueError("transport must be one of: 'tcp', 'websockets', 'unix'")

        # Initialize instance variables
        self._broker_url = broker_url
        self._broker_port = broker_port
        self._use_tls = use_tls
        self._max_retries = max_retries
        self._reconnect_delay = reconnect_delay
        
        self._connected = threading.Event()
        self._shutdown = threading.Event()
        self._lock = threading.RLock()
        self._connection_error = None
        
        # Message handling
        self._subscribers = {}
        self._local_queue = deque()
        self._warned_topics = set()
        
        # MQTT client setup
        self._client = mqtt.Client(
            client_id=client_id,
            clean_session=clean_session,
            userdata=None,
            protocol=protocol,  # type: ignore[arg-type]
            transport=transport,
        )
        
        # Configure automatic reconnection
        if self._max_retries > 0:
            self._client.reconnect_delay_set(
                min_delay=1, max_delay=int(self._reconnect_delay)
            )

        # Set up MQTT client callbacks
        self._client.on_connect = self._on_connect
        self._client.on_disconnect = self._on_disconnect
        self._client.on_message = self._on_message
        
        # Configure TLS if needed
        if use_tls:
            self._client.tls_set()  # Use default system CA certificates
            
        # Connect to the broker
        self._connect()

    def _connect(self) -> None:
        """Connect to the MQTT broker and start the network loop."""
        try:
            logging.info(
                "Connecting to MQTT broker at %s:%d...",
                self._broker_url,
                self._broker_port,
            )
            _ = self._client.connect(
                self._broker_url, self._broker_port, DEFAULT_KEEPALIVE
            )
            _ = self._client.loop_start()
        except (OSError, mqtt.WebsocketConnectionError) as e:
            error_msg = f"Failed to connect to MQTT broker: {e}"
            logging.error(error_msg)
            self._connection_error = error_msg
            raise ConnectionError(error_msg) from e

    def _resubscribe_topics(self) -> None:
        """Resubscribe to all registered topics after a (re)connection."""
        with self._lock:
            if not self._subscribers:
                return
            
            logging.debug("Resubscribing to %d topics...", len(self._subscribers))
            for topic in self._subscribers:
                try:
                    result, _ = self._client.subscribe(topic)
                    if result != mqtt.MQTT_ERR_SUCCESS:
                        logging.error(
                            "Failed to resubscribe to '%s' (code: %d)", topic, result
                        )
                except Exception as e:
                    logging.error(
                        "Exception while resubscribing to '%s': %s", topic, e, exc_info=True
                    )

    def _on_connect(
        self,
        _client: mqtt.Client,
        _userdata: object,  # noqa: ARG002
        _flags: dict[str, int],
        rc: int | ReasonCode,
        _properties: Properties | None = None,
    ) -> None:
        """Handle MQTT client connection events."""
        rc_int = rc if isinstance(rc, int) else rc.value

        if rc_int == 0:  # Connection successful
            logging.info("Successfully connected to MQTT broker.")
            self._connected.set()
            self._connection_error = None
            self._resubscribe_topics()
            self._process_local_queue()
        else:
            error_msg = f"Failed to connect to MQTT broker (code: {rc_int}) - {mqtt.connack_string(rc_int)}"
            logging.error(error_msg)
            self._connection_error = error_msg
            self._connected.clear()

    def _on_disconnect(
        self,
        _client: mqtt.Client,
        _userdata: object,  # noqa: ARG002
        rc: int | ReasonCode,
        _properties: Properties | None = None,
    ) -> None:
        """Handle MQTT client disconnection events."""
        self._connected.clear()
        if rc != 0:
            logging.warning("Unexpected disconnection from MQTT broker (code: %s).", rc)

    def _decode_message(self, msg: MQTTMessage) -> MessagePayload:
        """Decode the payload of an MQTT message.
        
        Tries to decode as JSON, falls back to a string, then to raw bytes.
        """
        try:
            text_payload = msg.payload.decode('utf-8')
            try:
                return cast(MessagePayload, json.loads(text_payload))
            except json.JSONDecodeError:
                return text_payload
        except UnicodeDecodeError:
            return msg.payload

    def _on_message(
        self,
        _client: mqtt.Client,
        _userdata: object,  # noqa: ARG002
        msg: MQTTMessage,
    ) -> None:
        """Handle incoming MQTT messages and invoke registered handlers."""
        try:
            payload = self._decode_message(msg)

            with self._lock:
                handlers = list(self._subscribers.get(msg.topic, []))

            if not handlers:
                if msg.topic not in self._warned_topics:
                    logging.warning("No handlers for topic '%s'", msg.topic)
                    self._warned_topics.add(msg.topic)
                return

            for handler in handlers:
                try:
                    handler(payload)
                except Exception as e:
                    logging.error(
                        "Error in message handler for topic '%s': %s",
                        msg.topic, e, exc_info=True
                    )
        except Exception as e:
            logging.error(
                "Error processing message on topic '%s': %s",
                getattr(msg, 'topic', 'unknown'), e, exc_info=True
            )

    def subscribe(self, topic: str, handler: Callable[[MessagePayload], None]) -> None:
        """Subscribe to a topic with a handler.
        
        Args:
            topic: The topic to subscribe to
            handler: Callback function to handle incoming messages
        """
        with self._lock:
            # Initialize topic if it doesn't exist
            if topic not in self._subscribers:
                self._subscribers[topic] = []
                # Only subscribe to the topic if we're connected
                if self._connected.is_set():
                    result, _ = self._client.subscribe(topic)
                    if result != 0:
                        logging.error("Failed to subscribe to %s (code: %d)", topic, result)
                        return
            
            # Add the handler if it's not already registered
            if handler not in self._subscribers[topic]:
                self._subscribers[topic].append(handler)
    
    def unsubscribe(self, topic: str, handler: Callable[[MessagePayload], None] | None = None) -> None:
        """Unsubscribe from a topic.

        Args:
            topic: The topic to unsubscribe from
            handler: Optional handler to remove. If None, all handlers for the topic are removed.
        """
        with self._lock:
            if topic not in self._subscribers:
                return

            should_unsubscribe = False
            if handler is None:
                should_unsubscribe = True
            elif handler in self._subscribers[topic]:
                self._subscribers[topic].remove(handler)
                if not self._subscribers[topic]:
                    should_unsubscribe = True

            if should_unsubscribe:
                del self._subscribers[topic]
                if self._connected.is_set():
                    result, _ = self._client.unsubscribe(topic)
                    if result != mqtt.MQTT_ERR_SUCCESS:
                        logging.error("Failed to unsubscribe from %s (code: %d)", topic, result)

    def publish(
        self,
        topic: str,
        message: MessagePayload,
        qos: int = 0,
        retain: bool = False,
    ) -> None:
        """Publish a message to a topic.

        If the router is not connected, the message will be queued locally and
        sent upon reconnection.

        Args:
            topic: The topic to publish to
            message: The message payload to send
            qos: Quality of Service level (0, 1, or 2)
            retain: Whether the message should be retained by the broker
        """
        try:
            message_bytes = self._encode_payload(message)

            if self._connected.is_set():
                logging.debug("Publishing message to '%s'", topic)
                _ = self._client.publish(topic, message_bytes, qos=qos, retain=retain)
            else:
                logging.warning(
                    "Client not connected. Queuing message for topic '%s'", topic
                )
                with self._lock:
                    self._local_queue.append((topic, message_bytes, qos, retain))
        except Exception as e:
            logging.error("Failed to publish message to '%s': %s", topic, e, exc_info=True)

    def _process_local_queue(self) -> None:
        """Process and send any messages stored in the local queue."""
        with self._lock:
            if not self._local_queue:
                return

            logging.info("Processing %d queued messages...", len(self._local_queue))
            while self._local_queue:
                topic, payload, qos, retain = self._local_queue.popleft()
                try:
                    _ = self._client.publish(topic, payload, qos=qos, retain=retain)
                    logging.debug("Published queued message to '%s'", topic)
                except Exception as e:
                    logging.error(
                        "Failed to publish queued message to '%s': %s", topic, e, exc_info=True
                    )
                    self._local_queue.appendleft((topic, payload, qos, retain))
                    break

    def _encode_payload(self, message: MessagePayload) -> bytes:
        """Encode a message payload into bytes for publishing."""
        if isinstance(message, bytes):
            return message
        if isinstance(message, (dict, list, SensorData)):
            data_to_serialize = asdict(message) if isinstance(message, SensorData) else message
            return json.dumps(data_to_serialize).encode('utf-8')
        if isinstance(message, str):
            return message.encode('utf-8')
        if isinstance(message, (int, float)):
            return str(message).encode('utf-8')
        if message is None:
            return b''

    def close(self) -> None:
        """Shut down the message router gracefully."""
        if self._shutdown.is_set():
            return

        logging.info("Shutting down message router...")
        self._shutdown.set()

        _ = self._client.loop_stop()
        _ = self._client.disconnect()

        logging.info("Message router shut down.")

    @property
    def is_connected(self) -> bool:
        """Return True if the client is currently connected to the broker."""
        return self._connected.is_set()

    @property
    def connection_error(self) -> str | None:
        """Return the last connection error message, if any."""
        return self._connection_error

    def __enter__(self) -> MessageRouter:
        """Enter the runtime context related to this object."""
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        """Exit the runtime context and close the connection."""
        self.close()

    def __del__(self) -> None:
        """Destructor to ensure cleanup."""
        self.close()
