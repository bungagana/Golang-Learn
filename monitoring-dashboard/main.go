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
	mux.HandleFunc("/api/raspberry", routes.GetRaspberryData)
	mux.HandleFunc("/api/sensor", routes.GetSensorData)
	mux.HandleFunc("/api/mppt", routes.GetMPPTData)

	// CORS handler
c := cors.New(cors.Options{
    AllowedOrigins:   []string{
        "https://dashboard-monitoring.si-akif.my.id",
        "https://dashboard-monitoring-zeta.vercel.app", 
    },
    AllowCredentials: true,
    AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
    AllowedHeaders:   []string{"*"},
})


handler := c.Handler(mux)


	fmt.Println("Server running di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

// package main

// import (
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"os"

// 	"monitoring-dashboard/importcsv"
// 	"monitoring-dashboard/routes"

// 	"github.com/rs/cors"
// )

// func main() {
// 	fmt.Println("Mulai import data...")

// 	// Import data dari file CSV (pastikan file ini tersedia di hosting nanti)
// 	importcsv.ImportRaspberryData("data/ITS_POME_RASP_20250727_213631.csv")
// 	importcsv.ImportSensorData("data/ITS-POME_27072025_213613.csv")
// 	importcsv.ImportMPPTData("data/MPPT_LOG_2025-07-27.csv")

// 	fmt.Println("Import selesai.")

// 	// Routing handler
// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/api/raspberry", routes.GetRaspberryData)
// 	mux.HandleFunc("/api/sensor", routes.GetSensorData)
// 	mux.HandleFunc("/api/mppt", routes.GetMPPTData)

// 	// CORS handler (agar bisa diakses dari frontend)
// 	handler := cors.AllowAll().Handler(mux)

// 	// Ambil PORT dari environment (WAJIB di Render)
// 	port := os.Getenv("PORT")
// 	if port == "" {
// 		port = "8080" // fallback default saat run lokal
// 	}

// 	fmt.Println("Server running di http://localhost:" + port)
// 	log.Fatal(http.ListenAndServe(":"+port, handler))
// }
