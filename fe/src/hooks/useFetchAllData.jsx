// import { useState, useEffect } from "react";

// const apiBase = "https://c96354a02b29.ngrok-free.app";

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

// Ganti ke URL Ngrok kamu sekarang (tanpa / di belakang)
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

        // Tambahkan header ngrok-skip-browser-warning
        const fetchWithHeaders = (url) =>
          fetch(url, {
            headers: { "ngrok-skip-browser-warning": "true" }
          });

        const [resRasp, resSens, resMppt] = await Promise.all([
          fetchWithHeaders(`${apiBase}/api/raspberry`),
          fetchWithHeaders(`${apiBase}/api/sensor`),
          fetchWithHeaders(`${apiBase}/api/mppt`)
        ]);

        // Kalau ada yang gagal, log error
        if (!resRasp.ok || !resSens.ok || !resMppt.ok) {
          console.error("Salah satu endpoint gagal:", {
            raspberry: resRasp.status,
            sensor: resSens.status,
            mppt: resMppt.status
          });
          throw new Error("Gagal fetch salah satu data dari server.");
        }

        // Parse JSON aman (debug kalau gagal)
        const parseSafe = async (res, name) => {
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            console.error(`Response ${name} bukan JSON:`, text);
            return null;
          }
        };

        const [raspJson, sensJson, mpptJson] = await Promise.all([
          parseSafe(resRasp, "Raspberry"),
          parseSafe(resSens, "Sensor"),
          parseSafe(resMppt, "MPPT")
        ]);

        // Set data dengan validasi biar gak crash
        const safeReverse = (data, name) => {
          if (Array.isArray(data)) return [...data].reverse();
          console.error(`Data ${name} bukan array:`, data);
          return [];
        };

        setRaspberryData(safeReverse(raspJson?.data, "Raspberry"));
        setSensorData(safeReverse(sensJson?.data, "Sensor"));
        setMpptData(safeReverse(mpptJson?.data, "MPPT"));
      } catch (err) {
        console.error(" Error di fetchData:", err);
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
