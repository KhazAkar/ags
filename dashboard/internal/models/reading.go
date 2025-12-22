package models

import (
	"encoding/json"
	"time"
)

type SensorReading struct {
	Timestamp      time.Time `json:"-"`
	SoilMoisture   float64   `json:"soil_moisture"`
	LightIntensity float64   `json:"light_intensity"`
	SoilTemp       float64   `json:"soil_temp"`
	AirTemp        float64   `json:"air_temp"`
	AirHumidity    float64   `json:"air_humidity"`
	AirPressure    float64   `json:"air_pressure"`
}

func (s *SensorReading) UnmarshalJSON(data []byte) error {
	type Alias SensorReading
	aux := &struct {
		Timestamp string `json:"timestamp"`
		*Alias
	}{
		Alias: (*Alias)(s),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	// Try multiple formats if needed, but stick to the primary one first
	timestamp, err := time.Parse(time.RFC3339, aux.Timestamp)
	if err != nil {
		return err
	}
	s.Timestamp = timestamp
	return nil
}

func (s SensorReading) MarshalJSON() ([]byte, error) {
	type Alias SensorReading
	aux := &struct {
		Timestamp string `json:"timestamp"`
		*Alias
	}{
		Timestamp: s.Timestamp.Format(time.RFC3339),
		Alias:     (*Alias)(&s),
	}
	return json.Marshal(aux)
}
