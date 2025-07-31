import { useState, useEffect } from "react";

const apiBase = "https://388466963364.ngrok-free.app";

const useFetchAllData = () => {
  const [raspberryData, setRaspberryData] = useState([]);
  const [raspberryColumns, setRaspberryColumns] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [sensorColumns, setSensorColumns] = useState([]);
  const [mpptData, setMpptData] = useState([]);
  const [mpptColumns, setMpptColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTable = async (table, setData, setColumns) => {
      const res = await fetch(`${apiBase}/api/data?table=${table}`, {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      if (!res.ok) throw new Error(`Gagal fetch ${table}`);
      const json = await res.json();
      setData([...json.data].reverse());
      setColumns(json.columns || []);
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTable("raspberry_stats", setRaspberryData, setRaspberryColumns),
          fetchTable("sensor_data", setSensorData, setSensorColumns),
          fetchTable("mppt_logs", setMpptData, setMpptColumns),
        ]);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    raspberryData, raspberryColumns,
    sensorData, sensorColumns,
    mpptData, mpptColumns,
    loading, error
  };
};

export default useFetchAllData;
