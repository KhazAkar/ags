package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"dashboard/internal/models"

	_ "modernc.org/sqlite"
)

type DB struct {
	conn *sql.DB
}

func New(dbPath string) (*DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	if err := initSchema(db); err != nil {
		return nil, fmt.Errorf("failed to initialize schema: %w", err)
	}

	return &DB{conn: db}, nil
}

func (d *DB) Close() error {
	return d.conn.Close()
}

func initSchema(db *sql.DB) error {
	query := `
		CREATE TABLE IF NOT EXISTS readings (
			timestamp TEXT,
			soil_moisture REAL,
			light_intensity REAL,
			soil_temp REAL,
			air_temp REAL,
			air_humidity REAL,
			air_pressure REAL
		);
	`
	_, err := db.Exec(query)
	return err
}

func (d *DB) InsertReading(ctx context.Context, r models.SensorReading) error {
	query := `
		INSERT INTO readings (timestamp, soil_moisture, light_intensity, soil_temp, air_temp, air_humidity, air_pressure) 
		VALUES(?, ?, ?, ?, ?, ?, ?)
	`
	_, err := d.conn.ExecContext(ctx, query,
		r.Timestamp.Format("2006-01-02 15:04:05"),
		r.SoilMoisture,
		r.LightIntensity,
		r.SoilTemp,
		r.AirTemp,
		r.AirHumidity,
		r.AirPressure,
	)
	return err
}

func (d *DB) GetReadings(ctx context.Context) ([]models.SensorReading, error) {
	query := `
		SELECT timestamp, soil_moisture, light_intensity, soil_temp, air_temp, air_humidity, air_pressure 
		FROM readings 
		ORDER BY timestamp
	`
	rows, err := d.conn.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var readings []models.SensorReading
	for rows.Next() {
		var r models.SensorReading
		var timestampStr string
		err := rows.Scan(
			&timestampStr,
			&r.SoilMoisture,
			&r.LightIntensity,
			&r.SoilTemp,
			&r.AirTemp,
			&r.AirHumidity,
			&r.AirPressure,
		)
		if err != nil {
			return nil, err
		}

		r.Timestamp, err = parseTimestamp(timestampStr)
		if err != nil {
			return nil, fmt.Errorf("failed to parse timestamp '%s': %w", timestampStr, err)
		}

		readings = append(readings, r)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return readings, nil
}

func parseTimestamp(ts string) (time.Time, error) {
	t, err := time.Parse("2006-01-02 15:04:05", ts)
	if err == nil {
		return t, nil
	}
	return time.Parse(time.RFC3339, ts)
}
