package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"flag"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"go.bug.st/serial"
)

const BUF_SIZE = 250

var client = &http.Client{
	Timeout: 10 * time.Second,
}

type SensorData struct {
	Timestamp       string  `json:"timestamp"`
	Moisture        int     `json:"moisture"`
	Photo           int     `json:"photo"`
	SoilTemperature float32 `json:"soil_temp"`
	AirTemperature  float32 `json:"air_temp"`
	AirHumidity     float32 `json:"air_hum"`
	AirPressure     float32 `json:"air_pressure"`
}

func main() {
	serverFlag := flag.String("s", "http://wyse5070.local:9999/ingest", "Server URL")
	portFlag := flag.String("p", "/dev/ttyAML6", "UART Port")
	baudRateFlag := flag.Int("b", 9600, "UART Baud Rate") // Added baud rate flag
	port := setUARTComms(*portFlag, *baudRateFlag)        // Pass baud rate to setUARTComms
	buf := make([]byte, BUF_SIZE)
	defer port.Close()
	for {
		n, err := port.Read(buf)
		if err != nil {
			log.Println("Error reading from UART:", err)
			continue // Continue loop instead of exiting on error
		}
		if n > 0 {
			sendUARTDataToServer(*serverFlag, buf[:n]) // Send only the read bytes
		}
	}
}

func setUARTComms(portStr string, baudRate int) serial.Port {
	mode := &serial.Mode{
		BaudRate: baudRate,
	}
	port, err := serial.Open(portStr, mode)
	if err != nil {
		log.Fatal(err)
	}
	return port
}

func sendUARTDataToServer(addressStr string, data []byte) {
	dataSplitted := strings.Split(string(data), ",")
	moisture, err1 := strconv.Atoi(dataSplitted[0])
	photo, err2 := strconv.Atoi(dataSplitted[1])
	soilTemp, err3 := strconv.ParseFloat(dataSplitted[2], 0)
	airTemp, err4 := strconv.ParseFloat(dataSplitted[3], 0)
	airHum, err5 := strconv.ParseFloat(dataSplitted[4], 0)
	airPressure, err6 := strconv.ParseFloat(dataSplitted[5], 0)

	if err := errors.Join(err1, err2, err3, err4, err5, err6); err != nil {
		log.Fatal("Unable to convert data into appropriate type: ", err)
	}

	ts := string(time.Now().Format(time.RFC3339))

	dataToSend := SensorData{
		Timestamp:       ts,
		Moisture:        moisture,
		Photo:           photo,
		SoilTemperature: float32(soilTemp),
		AirTemperature:  float32(airTemp),
		AirHumidity:     float32(airHum),
		AirPressure:     float32(airPressure),
	}
	jsonValue, err := json.Marshal(dataToSend)
	if err != nil {
		log.Fatal(err)
	}
	resp, err := client.Post(addressStr, "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		log.Println("Error sending data to server:", err)
		return
	}
	defer resp.Body.Close() // Ensure the response body is closed
	if resp.StatusCode != http.StatusOK {
		log.Println("Server responded with non-OK status:", resp.Status)
	}
}
