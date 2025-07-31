package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// Dynamic fetch dari table manapun
func GetDataDynamic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Ambil query param: table
	table := r.URL.Query().Get("table")
	if table == "" {
		http.Error(w, `{"status":"error","message":"Parameter 'table' wajib ada"}`, http.StatusBadRequest)
		return
	}

	// Buka database
	db, err := sql.Open("sqlite3", "./db/data.db")
	if err != nil {
		http.Error(w, `{"status":"error","message":"DB error"}`, http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Ambil semua kolom dari tabel
	colRows, err := db.Query(fmt.Sprintf("PRAGMA table_info(%s)", table))
	if err != nil {
		http.Error(w, `{"status":"error","message":"Tabel tidak ditemukan"}`, http.StatusInternalServerError)
		return
	}
	defer colRows.Close()

	columns := []string{}
	for colRows.Next() {
		var cid int
		var name string
		var ctype string
		var notnull int
		var dflt interface{}
		var pk int
		if err := colRows.Scan(&cid, &name, &ctype, &notnull, &dflt, &pk); err == nil {
			if name != "id" { // kolom id skip
				columns = append(columns, name)
			}
		}
	}

	if len(columns) == 0 {
		http.Error(w, `{"status":"error","message":"Kolom tidak ditemukan"}`, http.StatusInternalServerError)
		return
	}

	// Query data
	query := fmt.Sprintf("SELECT %s FROM %s ORDER BY id DESC", strings.Join(columns, ","), table)
	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, `{"status":"error","message":"Query error"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Ambil nilai rows dinamis
	results := []map[string]interface{}{}
	colCount := len(columns)

	for rows.Next() {
		// pointer untuk scan dinamis
		values := make([]interface{}, colCount)
		valuePtrs := make([]interface{}, colCount)
		for i := range values {
			valuePtrs[i] = &values[i]
		}

		if err := rows.Scan(valuePtrs...); err != nil {
			http.Error(w, `{"status":"error","message":"Data parsing error"}`, http.StatusInternalServerError)
			return
		}

		rowData := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			// Konversi []byte ke string
			if b, ok := val.([]byte); ok {
				rowData[col] = string(b)
			} else {
				rowData[col] = val
			}
		}
		results = append(results, rowData)
	}

	// Kirim JSON
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": fmt.Sprintf("Data dari tabel '%s' berhasil diambil", table),
		"columns": columns, // <-- urutan kolom asli DB
		"data":    results,
	})
}