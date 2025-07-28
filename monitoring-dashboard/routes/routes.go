package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

// Raspberry per jam
func GetRaspberryDataHourly(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT 
			strftime('%Y-%m-%d %H:00:00', timestamp) AS hour,
			AVG(cpu_temp), 
			AVG(cpu_usage), 
			AVG(mem_usage), 
			AVG(disk_usage)
		FROM raspberry_stats
		GROUP BY hour
		ORDER BY hour DESC
	`)
	if err != nil {
		http.Error(w, "Query error", 500)
		return
	}
	defer rows.Close()

	type HourlyRaspberryRow struct {
		Hour        string  `json:"hour"`
		AvgTemp     float64 `json:"avg_cpu_temp"`
		AvgCPU      float64 `json:"avg_cpu_usage"`
		AvgMem      float64 `json:"avg_mem_usage"`
		AvgDisk     float64 `json:"avg_disk_usage"`
	}

	var result []HourlyRaspberryRow

	for rows.Next() {
		var r HourlyRaspberryRow
		err := rows.Scan(&r.Hour, &r.AvgTemp, &r.AvgCPU, &r.AvgMem, &r.AvgDisk)
		if err != nil {
			http.Error(w, "Parsing error", 500)
			return
		}
		result = append(result, r)
	}

	json.NewEncoder(w).Encode(result)
}

// Sensor per jam
func GetSensorDataHourly(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT 
			strftime('%Y-%m-%d %H:00:00', timestamp) AS hour,
			AVG(temp), 
			AVG(humidity), 
			AVG(soil_moisture), 
			AVG(lux)
		FROM sensor_data
		GROUP BY hour
		ORDER BY hour DESC
	`)
	if err != nil {
		http.Error(w, "Query error", 500)
		return
	}
	defer rows.Close()

	type HourlySensorRow struct {
		Hour         string  `json:"hour"`
		AvgTemp      float64 `json:"avg_temp"`
		AvgHumidity  float64 `json:"avg_humidity"`
		AvgSoil      float64 `json:"avg_soil_moisture"`
		AvgLux       float64 `json:"avg_lux"`
	}

	var result []HourlySensorRow

	for rows.Next() {
		var r HourlySensorRow
		err := rows.Scan(&r.Hour, &r.AvgTemp, &r.AvgHumidity, &r.AvgSoil, &r.AvgLux)
		if err != nil {
			http.Error(w, "Parsing error", 500)
			return
		}
		result = append(result, r)
	}

	json.NewEncoder(w).Encode(result)
}

// MPPT per jam
func GetMPPTDataHourly(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT 
			strftime('%Y-%m-%d %H:00:00', timestamp) AS hour,
			AVG(pv_voltage),
			AVG(pv_current),
			AVG(battery_voltage),
			AVG(battery_current),
			AVG(load_voltage),
			AVG(load_current)
		FROM mppt_logs
		GROUP BY hour
		ORDER BY hour DESC
	`)
	if err != nil {
		http.Error(w, "Query error", 500)
		return
	}
	defer rows.Close()

	type HourlyMPPTRow struct {
		Hour            string  `json:"hour"`
		PVVoltage       float64 `json:"avg_pv_voltage"`
		PVCurrent       float64 `json:"avg_pv_current"`
		BatteryVoltage  float64 `json:"avg_battery_voltage"`
		BatteryCurrent  float64 `json:"avg_battery_current"`
		LoadVoltage     float64 `json:"avg_load_voltage"`
		LoadCurrent     float64 `json:"avg_load_current"`
	}

	var result []HourlyMPPTRow

	for rows.Next() {
		var r HourlyMPPTRow
		err := rows.Scan(
			&r.Hour,
			&r.PVVoltage,
			&r.PVCurrent,
			&r.BatteryVoltage,
			&r.BatteryCurrent,
			&r.LoadVoltage,
			&r.LoadCurrent,
		)
		if err != nil {
			http.Error(w, "Parsing error", 500)
			return
		}
		result = append(result, r)
	}

	json.NewEncoder(w).Encode(result)
}

// Realtime Raspberry Data
func GetRaspberryData(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, "DB error", 500)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT timestamp, cpu_temp, cpu_usage, mem_usage, disk_usage FROM raspberry_stats ORDER BY id DESC")
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

// Realtime Sensor Data
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

// Realtime MPPT Data
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
