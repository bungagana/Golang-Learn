import { useState, useEffect } from "react";

const apiBase = "https://388466963364.ngrok-free.app";

const useFetchAllData = () => {
  const [raspberryData, setRaspberryData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [mpptData, setMpptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching data dari: ${apiBase}`);

        // helper fetch
        const fetchTable = async (table) => {
          const res = await fetch(`${apiBase}/api/data?table=${table}`, {
            headers: { "ngrok-skip-browser-warning": "true" }
          });
          if (!res.ok) throw new Error(`Gagal fetch ${table}`);
          const json = await res.json();
          return json?.data || [];
        };

        // Ambil semua data tabel
        const [rasp, sens, mppt] = await Promise.all([
          fetchTable("raspberry_stats"),
          fetchTable("sensor_data"),
          fetchTable("mppt_logs")
        ]);

        // Reverse urutan agar terbaru di atas
        setRaspberryData([...rasp].reverse());
        setSensorData([...sens].reverse());
        setMpptData([...mppt].reverse());
      } catch (err) {
        console.error("Error di fetchData:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    raspberryData,
    sensorData,
    mpptData,
    loading,
    error
  };
};

export default useFetchAllData;
