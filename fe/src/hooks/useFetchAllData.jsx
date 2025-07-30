// import { useState, useEffect } from "react";

// // const apiBase = "http://localhost:8080";

// const apiBase = "https://5b9520d6c4be.ngrok-free.app";


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
//         // const [resRasp, resSens, resMppt] = await Promise.all([
//         //   fetch(`${apiBase}/api/raspberry`),
//         //   fetch(`${apiBase}/api/sensor`),
//         //   fetch(`${apiBase}/api/mppt`)
//         // ]);

//         const [resRasp, resSens, resMppt] = await Promise.all([
//         fetch(`${apiBase}/api/raspberry`),
//         fetch(`${apiBase}/api/sensor`),
//         fetch(`${apiBase}/api/mppt`)
//       ]);


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

//         console.log("raspJson", raspJson);
//         console.log("raspJson.data", raspJson.data);

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

const apiBase = "https://5b9520d6c4be.ngrok-free.app"; // ganti ke base URL kamu

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

      const headers = {
        "ngrok-skip-browser-warning": "true"
      };

      try {
        const [resRasp, resSens, resMppt] = await Promise.all([
          fetch(`${apiBase}/api/raspberry`, { headers }),
          fetch(`${apiBase}/api/sensor`, { headers }),
          fetch(`${apiBase}/api/mppt`, { headers })
        ]);

        if (!resRasp.ok || !resSens.ok || !resMppt.ok) {
          throw new Error("Gagal fetch salah satu data dari server.");
        }

        const [raspJson, sensJson, mpptJson] = await Promise.all([
          resRasp.json(),
          resSens.json(),
          resMppt.json()
        ]);

        // Safety check: pastikan .data array sebelum .reverse
        const safeReverse = (data) =>
          Array.isArray(data) ? [...data].reverse() : [];

        setRaspberryData(safeReverse(raspJson.data));
        setSensorData(safeReverse(sensJson.data));
        setMpptData(safeReverse(mpptJson.data));
      } catch (err) {
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
