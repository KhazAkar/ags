package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"time"

	"go.bug.st/serial"
)

const BUF_SIZE = 250

var client = &http.Client{
	Timeout: 10 * time.Second,
}

func main() {
	serverFlag := flag.String("s", "http://wyse5070.local:9999/ingest", "Server URL")
	portFlag := flag.String("p", "/dev/ttyAML6", "UART Port")
	port := setUARTComms(*portFlag)
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

func setUARTComms(portStr string) serial.Port {
	mode := &serial.Mode{
		BaudRate: 9600,
	}
	port, err := serial.Open(portStr, mode)
	if err != nil {
		log.Fatal(err)
	}
	return port
}

func sendUARTDataToServer(addressStr string, data []byte) {
	jsonData := map[string]string{"data": string(data)}
	jsonValue, err := json.Marshal(jsonData)
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
