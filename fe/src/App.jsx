import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const apiBase = "http://localhost:8080";

export default function App() {
  const [raspberryData, setRaspberryData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [mpptData, setMpptData] = useState([]);

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${apiBase}/api/raspberry`),
      fetch(`${apiBase}/api/sensor`),
      fetch(`${apiBase}/api/mppt`),
    ])
      .then(async ([resRasp, resSens, resMppt]) => {
        if (!resRasp.ok) throw new Error("Failed to fetch Raspberry data");
        if (!resSens.ok) throw new Error("Failed to fetch Sensor data");
        if (!resMppt.ok) throw new Error("Failed to fetch MPPT data");

        const rasp = await resRasp.json();
        const sens = await resSens.json();
        const mppt = await resMppt.json();

        setRaspberryData(rasp.reverse()); // urutkan naik (lama ke baru)
        setSensorData(sens.reverse());
        setMpptData(mppt.reverse());
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  // Simulasi 5 menit = 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => prev + 1);
    }, 1000); // 1 detik

    return () => clearInterval(interval);
  }, []);

  const getVisible = (data) => data.slice(0, visibleIndex + 1);

  if (loading) return <div className="status-msg">Loading data...</div>;
  if (error) return <div className="status-msg error">Error: {error}</div>;

  return (
    <div className="app-container">
      {/* CHARTS */}
      <div className="charts">
        <ChartSection title="Raspberry Pi" data={getVisible(raspberryData)} lines={[
          { key: "cpu_temp", color: "#ff5555", name: "CPU Temp (°C)" },
          { key: "cpu_usage", color: "#61dafb", name: "CPU Usage (%)" },
          { key: "mem_usage", color: "#50fa7b", name: "Memory Usage (%)" },
          { key: "disk_usage", color: "#ff79c6", name: "Disk Usage (%)" },
        ]} />

        <ChartSection title="Sensor Data" data={getVisible(sensorData)} lines={[
          { key: "temp", color: "#ffb86c", name: "Temperature (°C)" },
          { key: "humidity", color: "#8be9fd", name: "Humidity (%)" },
          { key: "soil_moisture", color: "#69f0ae", name: "Soil Moisture (%)" },
          { key: "lux", color: "#f1fa8c", name: "Lux" },
        ]} />

        <ChartSection title="MPPT Data" data={getVisible(mpptData)} lines={[
          { key: "pv_voltage", color: "#8aff80", name: "PV Voltage (V)" },
          { key: "pv_current", color: "#bd93f9", name: "PV Current (A)" },
          { key: "battery_voltage", color: "#ffb86c", name: "Battery Voltage (V)" },
          { key: "battery_current", color: "#ff5555", name: "Battery Current (A)" },
          { key: "load_voltage", color: "#8be9fd", name: "Load Voltage (V)" },
          { key: "load_current", color: "#50fa7b", name: "Load Current (A)" },
        ]} />
      </div>

      {/* TABLES */}
      <div className="tables">
        <TableSection
          title="Raspberry Pi Data"
          data={getVisible(raspberryData)}
          columns={["CPU Temp (°C)", "CPU Usage (%)", "Memory Usage (%)", "Disk Usage (%)"]}
          renderRow={(item) => [
            item.cpu_temp?.toFixed(2) ?? "-",
            item.cpu_usage?.toFixed(2) ?? "-",
            item.mem_usage?.toFixed(2) ?? "-",
            item.disk_usage?.toFixed(2) ?? "-",
          ]}
        />

        <TableSection
          title="Sensor Data"
          data={getVisible(sensorData)}
          columns={["Temp (°C)", "Humidity (%)", "Soil Moisture (%)", "Lux"]}
          renderRow={(item) => [
            item.temp?.toFixed(2) ?? "-",
            item.humidity?.toFixed(2) ?? "-",
            item.soil_moisture?.toFixed(2) ?? "-",
            item.lux?.toFixed(2) ?? "-",
          ]}
        />

        <TableSection
          title="MPPT Data"
          data={getVisible(mpptData)}
          columns={["PV Voltage", "PV Current", "Battery Voltage", "Battery Current", "Load Voltage", "Load Current"]}
          renderRow={(item) => [
            item.pv_voltage?.toFixed(2) ?? "-",
            item.pv_current?.toFixed(2) ?? "-",
            item.battery_voltage?.toFixed(2) ?? "-",
            item.battery_current?.toFixed(2) ?? "-",
            item.load_voltage?.toFixed(2) ?? "-",
            item.load_current?.toFixed(2) ?? "-",
          ]}
        />
      </div>
    </div>
  );
}

const ChartSection = ({ title, data, lines }) => (
  <section className="chart-section">
    <h2>{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="timestamp" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip />
        <Legend />
        {lines.map(({ key, color, name }) => (
          <Line key={key} type="monotone" dataKey={key} stroke={color} name={name} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </section>
);

const TableSection = ({ title, data, columns, renderRow }) => (
  <section className="table-section">
    <h3>{title}</h3>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            {columns.map((col, i) => <th key={i}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.timestamp}</td>
              {renderRow(item).map((val, idx) => <td key={idx}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
