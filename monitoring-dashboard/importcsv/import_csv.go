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
    // Pastikan folder ./db ada
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

func atof(str string) float64 {
    val, _ := strconv.ParseFloat(str, 64)
    return val
}

func ImportRaspberryData(filepath string) {
    db, err := openDB()
    if err != nil {
        fmt.Println("Error buka DB Raspberry:", err)
        return
    }
    defer db.Close()

    createTable := `
    CREATE TABLE IF NOT EXISTS raspberry_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT UNIQUE,
        cpu_percent REAL, cpu_freq_mhz REAL, cpu_temp_celsius REAL,
        memory_percent REAL, memory_used_gb REAL, memory_total_gb REAL,
        disk_percent REAL, disk_used_gb REAL, disk_total_gb REAL,
        load_1min REAL, load_5min REAL, load_15min REAL,
        network_bytes_sent REAL, network_bytes_recv REAL
    );`
    db.Exec(createTable)

    records, err := readCSV(filepath)
    if err != nil {
        fmt.Println("Gagal baca CSV raspberry:", err)
        return
    }

    stmt := `INSERT OR IGNORE INTO raspberry_stats 
    (timestamp,cpu_percent,cpu_freq_mhz,cpu_temp_celsius,
    memory_percent,memory_used_gb,memory_total_gb,
    disk_percent,disk_used_gb,disk_total_gb,
    load_1min,load_5min,load_15min,
    network_bytes_sent,network_bytes_recv)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

    for i, row := range records {
        if i == 0 {
            continue
        }
        db.Exec(stmt, row[0], atof(row[1]), atof(row[2]), atof(row[3]),
            atof(row[4]), atof(row[5]), atof(row[6]),
            atof(row[7]), atof(row[8]), atof(row[9]),
            atof(row[10]), atof(row[11]), atof(row[12]),
            atof(row[13]), atof(row[14]))
    }

    fmt.Println("Data Raspberry masuk semua kolom.")
}

func ImportSensorData(filepath string) {
    db, err := openDB()
    if err != nil {
        fmt.Println("Error buka DB Sensor:", err)
        return
    }
    defer db.Close()

    createTable := `
    CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT UNIQUE,
        u1_temp_water REAL, u1_tds REAL, u1_do REAL, u1_ph REAL,
        u2_light REAL, u2_o2 REAL, u2_temp_air REAL, u2_pressure REAL,
        u2_altitude REAL, u2_humidity REAL, u2_nh3_air REAL, u2_turbidity REAL
    );`
    db.Exec(createTable)

    records, err := readCSV(filepath)
    if err != nil {
        fmt.Println("Gagal baca CSV sensor:", err)
        return
    }

    stmt := `INSERT OR IGNORE INTO sensor_data 
    (timestamp,u1_temp_water,u1_tds,u1_do,u1_ph,
    u2_light,u2_o2,u2_temp_air,u2_pressure,
    u2_altitude,u2_humidity,u2_nh3_air,u2_turbidity)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`

    for i, row := range records {
        if i == 0 {
            continue
        }
        db.Exec(stmt, row[0], atof(row[1]), atof(row[2]), atof(row[3]), atof(row[4]),
            atof(row[5]), atof(row[6]), atof(row[7]), atof(row[8]),
            atof(row[9]), atof(row[10]), atof(row[11]), atof(row[12]))
    }

    fmt.Println("Data Sensor masuk semua kolom.")
}

func ImportMPPTData(filepath string) {
    db, err := openDB()
    if err != nil {
        fmt.Println("Error buka DB MPPT:", err)
        return
    }
    defer db.Close()

    createTable := `
    CREATE TABLE IF NOT EXISTS mppt_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT UNIQUE,
        pv_voltage REAL, pv_current REAL, pv_power REAL,
        battery_voltage REAL, battery_charge_current REAL, battery_charge_power REAL,
        battery_remaining REAL, battery_temp REAL, battery_overall_current REAL,
        load_current REAL, load_power REAL, device_temp REAL
    );`
    db.Exec(createTable)

    records, err := readCSV(filepath)
    if err != nil {
        fmt.Println("Gagal baca CSV MPPT:", err)
        return
    }

    stmt := `INSERT OR IGNORE INTO mppt_logs 
    (timestamp,pv_voltage,pv_current,pv_power,
    battery_voltage,battery_charge_current,battery_charge_power,
    battery_remaining,battery_temp,battery_overall_current,
    load_current,load_power,device_temp)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`

    for i, row := range records {
        if i == 0 {
            continue
        }
        db.Exec(stmt, row[0], atof(row[1]), atof(row[2]), atof(row[3]),
            atof(row[4]), atof(row[5]), atof(row[6]),
            atof(row[7]), atof(row[8]), atof(row[9]),
            atof(row[10]), atof(row[11]), atof(row[12]))
    }

    fmt.Println("Data MPPT masuk semua kolom.")
}
