package importcsv

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"os"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

func openDB() (*sql.DB, error) {
	// Buat folder ./db kalau belum ada
	if _, err := os.Stat("./db"); os.IsNotExist(err) {
		err := os.Mkdir("./db", os.ModePerm)
		if err != nil {
			return nil, fmt.Errorf("gagal buat folder db: %v", err)
		}
	}

	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		return nil, fmt.Errorf("gagal buka database: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("tidak bisa konek ke DB: %v", err)
	}

	// Buat tabel dengan timestamp sebagai UNIQUE
	createTables := `
	CREATE TABLE IF NOT EXISTS raspberry_stats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp TEXT UNIQUE,
		cpu_temp REAL,
		cpu_usage REAL,
		mem_usage REAL,
		disk_usage REAL
	);

	CREATE TABLE IF NOT EXISTS sensor_data (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp TEXT UNIQUE,
		temp REAL,
		humidity REAL,
		soil_moisture REAL,
		lux REAL
	);

	CREATE TABLE IF NOT EXISTS mppt_logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp TEXT UNIQUE,
		pv_voltage REAL,
		pv_current REAL,
		battery_voltage REAL,
		battery_current REAL,
		load_voltage REAL,
		load_current REAL
	);
	`

	if _, err := db.Exec(createTables); err != nil {
		return nil, fmt.Errorf("gagal buat tabel: %v", err)
	}

	return db, nil
}

func readCSV(filepath string) ([][]string, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	return reader.ReadAll()
}

func ImportRaspberryData(filepath string) {
	db, err := openDB()
	if err != nil {
		fmt.Println("Error buka DB Raspberry:", err)
		return
	}
	defer db.Close()

	records, err := readCSV(filepath)
	if err != nil {
		fmt.Println("Gagal baca CSV raspberry:", err)
		return
	}

	stmt := `INSERT OR IGNORE INTO raspberry_stats (timestamp, cpu_temp, cpu_usage, mem_usage, disk_usage) VALUES (?, ?, ?, ?, ?)`

	for i, row := range records {
		if i == 0 {
			continue
		}
		db.Exec(stmt, row[0], atof(row[1]), atof(row[2]), atof(row[3]), atof(row[4]))
	}

	fmt.Println("Data Raspberry berhasil diimport.")
}

func ImportSensorData(filepath string) {
	db, err := openDB()
	if err != nil {
		fmt.Println("Error buka DB Sensor:", err)
		return
	}
	defer db.Close()

	records, err := readCSV(filepath)
	if err != nil {
		fmt.Println("Gagal baca CSV sensor:", err)
		return
	}

	stmt := `INSERT OR IGNORE INTO sensor_data (timestamp, temp, humidity, soil_moisture, lux) VALUES (?, ?, ?, ?, ?)`

	for i, row := range records {
		if i == 0 {
			continue
		}
		db.Exec(stmt, row[0], atof(row[1]), atof(row[2]), atof(row[3]), atof(row[4]))
	}

	fmt.Println("Data Sensor berhasil diimport.")
}

func ImportMPPTData(filepath string) {
	db, err := openDB()
	if err != nil {
		fmt.Println("Error buka DB MPPT:", err)
		return
	}
	defer db.Close()

	records, err := readCSV(filepath)
	if err != nil {
		fmt.Println("Gagal baca CSV MPPT:", err)
		return
	}

	stmt := `INSERT OR IGNORE INTO mppt_logs (timestamp, pv_voltage, pv_current, battery_voltage, battery_current, load_voltage, load_current) VALUES (?, ?, ?, ?, ?, ?, ?)`

	for i, row := range records {
		if i == 0 {
			continue
		}
		db.Exec(stmt, row[0], atof(row[1]), atof(row[2]), atof(row[3]), atof(row[4]), atof(row[5]), atof(row[6]))
	}

	fmt.Println("Data MPPT berhasil diimport.")
}

func atof(str string) float64 {
	val, _ := strconv.ParseFloat(str, 64)
	return val
}
