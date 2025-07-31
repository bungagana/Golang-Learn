// import { useState, useEffect } from "react";

// const apiBase = "http://localhost:8080";

// const useFetchAllData = () => {
//   const [raspberryData, setRaspberryData] = useState([]);
//   const [sensorData, setSensorData] = useState([]);
//   const [mpptData, setMpptData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // Fetch semua endpoint paralel
//         const [resRasp, resSens, resMppt] = await Promise.all([
//           fetch(`${apiBase}/api/raspberry`),
//           fetch(`${apiBase}/api/sensor`),
//           fetch(`${apiBase}/api/mppt`)
//         ]);

//         // Cek status code response
//         if (!resRasp.ok || !resSens.ok || !resMppt.ok) {
//           throw new Error("Gagal fetch salah satu data dari server.");
//         }

//         // Ambil JSON dari masing-masing respons
//         const [raspJson, sensJson, mpptJson] = await Promise.all([
//           resRasp.json(),
//           resSens.json(),
//           resMppt.json()
//         ]);

//         // Set data ke state (reverse biar urutan terbaru ke atas)
//         setRaspberryData(Array.isArray(raspJson.data) ? raspJson.data.reverse() : []);
//         setSensorData(Array.isArray(sensJson.data) ? sensJson.data.reverse() : []);
//         setMpptData(Array.isArray(mpptJson.data) ? mpptJson.data.reverse() : []);
//       } catch (err) {
//         setError(err.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return {
//     raspberryData,
//     sensorData,
//     mpptData,
//     loading,
//     error
//   };
// };

// export default useFetchAllData;
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
        // Fetch semua endpoint paralel tapi masing2 aman dari error
        const fetchWithLog = async (url, name) => {
          try {
            console.log(`🔎 Fetching ${name}: ${url}`);
            const res = await fetch(url);

            // Kalau status bukan 200, log error
            if (!res.ok) {
              console.error(`❌ ${name} gagal: ${res.status} ${res.statusText}`);
              return null;
            }

            const json = await res.json();
            console.log(`✅ ${name} berhasil:`, json);

            return json;
          } catch (err) {
            console.error(`🔥 Error fetch ${name}:`, err);
            return null;
          }
        };

        const [raspJson, sensJson, mpptJson] = await Promise.all([
          fetchWithLog(`${apiBase}/api/raspberry`, "Raspberry"),
          fetchWithLog(`${apiBase}/api/sensor`, "Sensor"),
          fetchWithLog(`${apiBase}/api/mppt`, "MPPT")
        ]);

        // Validasi & set state dengan aman
        const safeArray = (data, name) => {
          if (!data || !Array.isArray(data.data)) {
            console.error(`⚠️ Data ${name} bukan array atau null:`, data);
            return [];
          }
          return [...data.data].reverse(); // copy + reverse
        };

        setRaspberryData(safeArray(raspJson, "Raspberry"));
        setSensorData(safeArray(sensJson, "Sensor"));
        setMpptData(safeArray(mpptJson, "MPPT"));
      } catch (err) {
        console.error("🔥 Fatal error:", err);
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
