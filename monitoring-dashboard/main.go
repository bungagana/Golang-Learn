package main

import (
	"fmt"
	"log"
	"monitoring-dashboard/importcsv"
	"monitoring-dashboard/routes"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	fmt.Println("Mulai import data...")

	importcsv.ImportRaspberryData("data/ITS_POME_RASP_20250727_213631.csv")
	importcsv.ImportSensorData("data/ITS-POME_27072025_213613.csv")
	importcsv.ImportMPPTData("data/MPPT_LOG_2025-07-27.csv")

	fmt.Println("Import selesai.")

	mux := http.NewServeMux()
	// Endpoint data realtime (semua data)
	mux.HandleFunc("/api/raspberry", routes.GetRaspberryData)
	mux.HandleFunc("/api/sensor", routes.GetSensorData)
	mux.HandleFunc("/api/mppt", routes.GetMPPTData)

	// Endpoint data hourly (aggregated per jam)
	mux.HandleFunc("/api/raspberry/hourly", routes.GetRaspberryDataHourly)
	mux.HandleFunc("/api/sensor/hourly", routes.GetSensorDataHourly)
	mux.HandleFunc("/api/mppt/hourly", routes.GetMPPTDataHourly)

	handler := cors.AllowAll().Handler(mux)

	fmt.Println("Server running di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
