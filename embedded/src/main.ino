#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP280.h>
#include <OneWire.h>
#include <DallasTemperature.h>
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
void setup() {
  Serial.begin(9600);
  while (!Serial) delay(10);
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
void loop() {
  // Read soil moisture first
  int moisturePercent = readSoilMoisture();
  // Small delay to avoid interference
  delay(50);
  // Read DS18B20
  float soilTempC = readDS18B20Temp();
  // Small delay to avoid interference
  int photoPercent = readPhotoValue();
  // Read AHT20 and BMP280
  sensors_event_t humidity, temp;
  aht.getEvent(&humidity, &temp);
  float pressure = bmp.readPressure() / 100.0F;
  // Log data (CSV)
  Serial.print(moisturePercent);
  Serial.print(",");
  Serial.print(photoPercent);
  Serial.print(",");
  Serial.print(soilTempC);
  Serial.print(",");
  Serial.print(temp.temperature);
  Serial.print(",");
  Serial.print(humidity.relative_humidity);
  Serial.print(",");
  Serial.println(pressure);
  delay(interval);
}