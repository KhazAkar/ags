#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP280.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <SPI.h>
#include <mcp2515.h>

// --- CAN Configuration ---
MCP2515 mcp2515(10); // CS pin for CAN module

// --- Pin Definitions ---
#define SOIL_MOISTURE_PIN A0
#define PHOTORESISTOR_PIN A1
#define ONE_WIRE_BUS 2

// --- Sensor Objects ---
Adafruit_AHTX0 aht;
Adafruit_BMP280 bmp;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);

// --- Calibration Variables ---
int soilMoistureMin = 275;  // Wet (glass of water)
int soilMoistureMax = 687;  // Dry (air)
int photoLightMin = 4;
int photoLightMax = 1017;
unsigned long previousMillis = 0;
const long interval = 900000; // 15 minutes in milliseconds

// CAN message structure matching your Go decoder
struct CANFrame {
  uint8_t soilMoisture;
  uint8_t airHumidity;
  int16_t soilTemp;      // ×100 for 0.01°C resolution
  int16_t airTemp;       // ×100 for 0.01°C resolution
  uint8_t airPressure;   // Scaled to 0-255 (500-1100 hPa)
  uint8_t lightIntensity; // MSB of 0-65535 lux
};

void setup() {
  Serial.begin(9600);
  while (!Serial) delay(10);

  // Initialize CAN
  SPI.begin();
  mcp2515.reset();
  mcp2515.setBitrate(CAN_125KBPS);
  mcp2515.setNormalMode();

  analogReference(EXTERNAL);

  // Initialize sensors
  if (!aht.begin()) {
    Serial.println("Failed to initialize AHT20!");
    while (1) delay(10);
  }
  if (!bmp.begin(0x77)) {
    Serial.println("Failed to initialize BMP280!");
    while (1) delay(10);
  }
  ds18b20.begin();
}

int readScaledValue(uint8_t analog_pin, int minVal, int maxVal) {
    int sum = 0;
    for (int i = 0; i < 10; i++) {  // Average 10 readings
      sum += analogRead(analog_pin);
      delay(10);
    }
    int rawValue = sum / 10;
    // Map the raw value to percentage (inverted)
    int percent = map(rawValue, minVal, maxVal, 100, 0);
    return constrain(percent, 0, 100);
}

int readSoilMoisture() {
  return readScaledValue(SOIL_MOISTURE_PIN, soilMoistureMin, soilMoistureMax);
}

int readPhotoValue() {
  return readScaledValue(PHOTORESISTOR_PIN, photoLightMin, photoLightMax);
}

float readDS18B20Temp() {
  ds18b20.requestTemperatures();
  return ds18b20.getTempCByIndex(0);
}

void sendCANMessage(CANFrame &frame) {
  struct can_frame canMsg;
  canMsg.can_id = 0x100; // Match your Go decoder
  canMsg.can_dlc = 8;
  memcpy(canMsg.data, &frame, sizeof(frame));
  mcp2515.sendMessage(&canMsg);
}

void loop() {
  CANFrame frame;

  // Read sensors
  frame.soilMoisture = readSoilMoisture();
  delay(50);

  frame.soilTemp = (int16_t)(readDS18B20Temp() * 100); // Convert to 0.01°C

  int photoPercent = readPhotoValue();
  sensors_event_t humidity, temp;
  aht.getEvent(&humidity, &temp);

  // Scale values for CAN frame
  frame.airHumidity = (uint8_t)humidity.relative_humidity;
  frame.airTemp = (int16_t)(temp.temperature * 100); // Convert to 0.01°C
  frame.airPressure = constrain((int)((bmp.readPressure()/100.0F) - 500) / 2.35, 0, 255);
  frame.lightIntensity = map(photoPercent, 0, 100, 0, 255); // Scale to 8-bit

  // Send via CAN
  sendCANMessage(frame);

  // Debug output (optional)
  Serial.print("Sent: ");
  Serial.print(frame.soilMoisture); Serial.print("%,");
  Serial.print(frame.airHumidity); Serial.print("%,");
  Serial.print(frame.soilTemp/100.0); Serial.print("°C,");
  Serial.print(frame.airTemp/100.0); Serial.print("°C,");
  Serial.print(frame.airPressure*2.35 + 500); Serial.print("hPa,");
  Serial.print(frame.lightIntensity); Serial.println(" (light)");

  delay(interval);
}