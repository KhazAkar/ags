package config

import (
	"os"
)

type Config struct {
	ServerAddress string
	DatabasePath  string
	TemplatesPath string
}

func Load() *Config {
	return &Config{
		ServerAddress: getEnv("SERVER_ADDRESS", ":8000"),
		DatabasePath:  getEnv("DATABASE_PATH", "data.db"),
		TemplatesPath: getEnv("TEMPLATES_PATH", "templates"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
