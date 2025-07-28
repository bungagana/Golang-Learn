package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func GetRaspberryData(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT timestamp, cpu_temp, cpu_usage, mem_usage, disk_usage FROM raspberry_stats ORDER BY id DESC LIMIT 10")
	if err != nil {
		http.Error(w, "Query error", 500)
		return
	}
	defer rows.Close()

	type RaspberryRow struct {
		Timestamp  string  `json:"timestamp"`
		CPUTemp    float64 `json:"cpu_temp"`
		CPUUsage   float64 `json:"cpu_usage"`
		MemUsage   float64 `json:"mem_usage"`
		DiskUsage  float64 `json:"disk_usage"`
	}

	var result []RaspberryRow

	for rows.Next() {
		var r RaspberryRow
		rows.Scan(&r.Timestamp, &r.CPUTemp, &r.CPUUsage, &r.MemUsage, &r.DiskUsage)
		result = append(result, r)
	}

	json.NewEncoder(w).Encode(result)
}

// Fungsi serupa bisa kamu duplikat untuk sensor dan MPPT
func GetSensorData(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT timestamp, temp, humidity, soil_moisture, lux 
		FROM sensor_data 
		ORDER BY id DESC 
	`)
	if err != nil {
		http.Error(w, "Query error", 500)
		return
	}
	defer rows.Close()

	type SensorRow struct {
		Timestamp     string  `json:"timestamp"`
		Temp          float64 `json:"temp"`
		Humidity      float64 `json:"humidity"`
		SoilMoisture  float64 `json:"soil_moisture"`
		Lux           float64 `json:"lux"`
	}

	var result []SensorRow

	for rows.Next() {
		var r SensorRow
		err := rows.Scan(&r.Timestamp, &r.Temp, &r.Humidity, &r.SoilMoisture, &r.Lux)
		if err != nil {
			http.Error(w, "Data parsing error", 500)
			return
		}
		result = append(result, r)
	}

	json.NewEncoder(w).Encode(result)
}


func GetMPPTData(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT timestamp, pv_voltage, pv_current, battery_voltage, battery_current, load_voltage, load_current 
		FROM mppt_logs 
		ORDER BY id DESC 
		LIMIT 10
	`)
	if err != nil {
		http.Error(w, "Query error", 500)
		return
	}
	defer rows.Close()

	type MPPTRow struct {
		Timestamp       string  `json:"timestamp"`
		PVVoltage       float64 `json:"pv_voltage"`
		PVCurrent       float64 `json:"pv_current"`
		BatteryVoltage  float64 `json:"battery_voltage"`
		BatteryCurrent  float64 `json:"battery_current"`
		LoadVoltage     float64 `json:"load_voltage"`
		LoadCurrent     float64 `json:"load_current"`
	}

	var result []MPPTRow

	for rows.Next() {
		var r MPPTRow
		err := rows.Scan(
			&r.Timestamp,
			&r.PVVoltage,
			&r.PVCurrent,
			&r.BatteryVoltage,
			&r.BatteryCurrent,
			&r.LoadVoltage,
			&r.LoadCurrent,
		)
		if err != nil {
			http.Error(w, "Data parsing error", 500)
			return
		}
		result = append(result, r)
	}

	json.NewEncoder(w).Encode(result)
}

