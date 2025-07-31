import React, { useEffect, useState } from "react";
import ChartSection from "./components/ChartSection";
import TableSection from "./components/TableSection";
import useFetchAllData from "./hooks/useFetchAllData";

const ITEMS_PER_PAGE = 10;

export default function App() {
  const { raspberryData, sensorData, mpptData, loading, error } = useFetchAllData();

  const [visibleIndex, setVisibleIndex] = useState(0); // buat animasi muncul data
  const [page, setPage] = useState(0); // pagination halaman

  // animasi data masuk 1 per 1
  useEffect(() => {
    if (!raspberryData.length && !sensorData.length && !mpptData.length) return;

    const maxLength = Math.max(
      raspberryData.length,
      sensorData.length,
      mpptData.length
    );

    const interval = setInterval(() => {
      setVisibleIndex((prev) => {
        if (prev + 1 >= maxLength) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [raspberryData, sensorData, mpptData]);

  // Data yang muncul sesuai animasi
  const getVisible = (data) => data.slice(0, visibleIndex + 1);

  // Data sesuai halaman aktif
  const getPageData = (data) => {
    const start = page * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  // Hitung total halaman
  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  if (loading) return <div className="status-msg">Loading data...</div>;
  if (error) return <div className="status-msg error">Error: {error}</div>;

  return (
    <div className="app-container">
      {/* Bagian Chart Dynamic */}
      <div className="charts">
        <ChartSection title="Raspberry Pi Data" data={getVisible(raspberryData)} />
        <ChartSection title="Sensor Data" data={getVisible(sensorData)} />
        <ChartSection title="MPPT Data" data={getVisible(mpptData)} />
      </div>

      {/* Bagian Table Dynamic */}
      <div className="tables">
        <TableSection
          title="Raspberry Pi Data"
          data={getPageData(getVisible(raspberryData))}
          page={page}
          totalPages={totalPages(getVisible(raspberryData))}
          onPageChange={setPage}
        />

        <TableSection
          title="Sensor Data"
          data={getPageData(getVisible(sensorData))}
          page={page}
          totalPages={totalPages(getVisible(sensorData))}
          onPageChange={setPage}
        />

        <TableSection
          title="MPPT Data"
          data={getPageData(getVisible(mpptData))}
          page={page}
          totalPages={totalPages(getVisible(mpptData))}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
