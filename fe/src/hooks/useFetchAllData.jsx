import { useState, useEffect } from "react";

const apiBase = "http://localhost:8080";

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
        const [resRasp, resSens, resMppt] = await Promise.all([
          fetch(`${apiBase}/api/raspberry`),
          fetch(`${apiBase}/api/sensor`),
          fetch(`${apiBase}/api/mppt`),
        ]);

        if (!resRasp.ok || !resSens.ok || !resMppt.ok) {
          throw new Error("Failed to fetch some data");
        }

        const [rasp, sens, mppt] = await Promise.all([
          resRasp.json(),
          resSens.json(),
          resMppt.json(),
        ]);

        setRaspberryData(rasp.reverse());
        setSensorData(sens.reverse());
        setMpptData(mppt.reverse());
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { raspberryData, sensorData, mpptData, loading, error };
};

export default useFetchAllData;
