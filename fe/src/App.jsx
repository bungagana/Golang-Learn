import React, { useEffect, useState } from "react";
import ChartSection from "./components/ChartSection";
import TableSection from "./components/TableSection";
import useFetchAllData from "./hooks/useFetchAllData";

const ITEMS_PER_PAGE = 10; 

export default function App() {
  const { raspberryData, sensorData, mpptData, loading, error } = useFetchAllData();

  const [visibleIndex, setVisibleIndex] = useState(0); // interval display
  const [page, setPage] = useState(0); 

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => prev + 1);
    }, 1000); //1s
    return () => clearInterval(interval);
  }, []);

  const getVisible = (data) => data.slice(0, visibleIndex + 1);

  const getPageData = (data) => {
    const start = page * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  if (loading) return <div className="status-msg">Loading data...</div>;
  if (error) return <div className="status-msg error">Error: {error}</div>;

  return (
    <div className="app-container">
      {/* Charts */}
      <div className="charts">
        <ChartSection
          title="Raspberry Pi"
          data={getVisible(raspberryData)}
          lines={[
            { key: "cpu_temp", color: "#ff5555", name: "CPU Temp (°C)" },
            { key: "cpu_usage", color: "#61dafb", name: "CPU Usage (%)" },
            { key: "mem_usage", color: "#50fa7b", name: "Memory Usage (%)" },
            { key: "disk_usage", color: "#ff79c6", name: "Disk Usage (%)" },
          ]}
        />

        <ChartSection
          title="Sensor Data"
          data={getVisible(sensorData)}
          lines={[
            { key: "temp", color: "#ffb86c", name: "Temperature (°C)" },
            { key: "humidity", color: "#8be9fd", name: "Humidity (%)" },
            { key: "soil_moisture", color: "#69f0ae", name: "Soil Moisture (%)" },
            { key: "lux", color: "#f1fa8c", name: "Lux" },
          ]}
        />

        <ChartSection
          title="MPPT Data"
          data={getVisible(mpptData)}
          lines={[
            { key: "pv_voltage", color: "#8aff80", name: "PV Voltage (V)" },
            { key: "pv_current", color: "#bd93f9", name: "PV Current (A)" },
            { key: "battery_voltage", color: "#ffb86c", name: "Battery Voltage (V)" },
            { key: "battery_current", color: "#ff5555", name: "Battery Current (A)" },
            { key: "load_voltage", color: "#8be9fd", name: "Load Voltage (V)" },
            { key: "load_current", color: "#50fa7b", name: "Load Current (A)" },
          ]}
        />
      </div>

      {/* Tables */}
      <div className="tables">
        <TableSection
          title="Raspberry Pi Data"
          data={getPageData(getVisible(raspberryData))}
          columns={["CPU Temp (°C)", "CPU Usage (%)", "Memory Usage (%)", "Disk Usage (%)"]}
          renderRow={(item) => [
            item.cpu_temp?.toFixed(2) ?? "-",
            item.cpu_usage?.toFixed(2) ?? "-",
            item.mem_usage?.toFixed(2) ?? "-",
            item.disk_usage?.toFixed(2) ?? "-",
          ]}
          page={page}
          totalPages={totalPages(getVisible(raspberryData))}
          onPageChange={setPage}
        />

        <TableSection
          title="Sensor Data"
          data={getPageData(getVisible(sensorData))}
          columns={["Temp (°C)", "Humidity (%)", "Soil Moisture (%)", "Lux"]}
          renderRow={(item) => [
            item.temp?.toFixed(2) ?? "-",
            item.humidity?.toFixed(2) ?? "-",
            item.soil_moisture?.toFixed(2) ?? "-",
            item.lux?.toFixed(2) ?? "-",
          ]}
          page={page}
          totalPages={totalPages(getVisible(sensorData))}
          onPageChange={setPage}
        />

        <TableSection
          title="MPPT Data"
          data={getPageData(getVisible(mpptData))}
          columns={["PV Voltage", "PV Current", "Battery Voltage", "Battery Current", "Load Voltage", "Load Current"]}
          renderRow={(item) => [
            item.pv_voltage?.toFixed(2) ?? "-",
            item.pv_current?.toFixed(2) ?? "-",
            item.battery_voltage?.toFixed(2) ?? "-",
            item.battery_current?.toFixed(2) ?? "-",
            item.load_voltage?.toFixed(2) ?? "-",
            item.load_current?.toFixed(2) ?? "-",
          ]}
          page={page}
          totalPages={totalPages(getVisible(mpptData))}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
