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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all hourly data in parallel
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${apiBase}/api/raspberry/hourly`),
      fetch(`${apiBase}/api/sensor/hourly`),
      fetch(`${apiBase}/api/mppt/hourly`),
    ])
      .then(async ([resRasp, resSens, resMppt]) => {
        if (!resRasp.ok)
          throw new Error("Failed to fetch Raspberry hourly data");
        if (!resSens.ok) throw new Error("Failed to fetch Sensor hourly data");
        if (!resMppt.ok) throw new Error("Failed to fetch MPPT hourly data");

        const raspJson = await resRasp.json();
        const sensJson = await resSens.json();
        const mpptJson = await resMppt.json();

        setRaspberryData(raspJson);
        setSensorData(sensJson);
        setMpptData(mpptJson);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading data...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Data Per Jam (Hourly Data)</h1>

      {/* Raspberry Chart */}
      <section style={{ marginBottom: 50 }}>
        <h2>Raspberry Pi</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={raspberryData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg_cpu_temp"
              stroke="#ff0000"
              name="CPU Temp (°C)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_cpu_usage"
              stroke="#0000ff"
              name="CPU Usage (%)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_mem_usage"
              stroke="#00ff00"
              name="Memory Usage (%)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_disk_usage"
              stroke="#ff00ff"
              name="Disk Usage (%)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <table
          border="1"
          cellPadding="8"
          style={{ marginTop: 15, width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Hour</th>
              <th>CPU Temp (°C)</th>
              <th>CPU Usage (%)</th>
              <th>Memory Usage (%)</th>
              <th>Disk Usage (%)</th>
            </tr>
          </thead>
          <tbody>
            {raspberryData.map((item, i) => (
              <tr key={i}>
                <td>{item.hour}</td>
                <td>{item.avg_cpu_temp?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_cpu_usage?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_mem_usage?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_disk_usage?.toFixed(2) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sensor Chart */}
      <section style={{ marginBottom: 50 }}>
        <h2>Sensor Data</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg_temp"
              stroke="#ff6600"
              name="Temperature (°C)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_humidity"
              stroke="#0066ff"
              name="Humidity (%)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_soil_moisture"
              stroke="#339966"
              name="Soil Moisture (%)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_lux"
              stroke="#ffcc00"
              name="Lux"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <table
          border="1"
          cellPadding="8"
          style={{ marginTop: 15, width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Hour</th>
              <th>Temp (°C)</th>
              <th>Humidity (%)</th>
              <th>Soil Moisture (%)</th>
              <th>Lux</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((item, i) => (
              <tr key={i}>
                <td>{item.hour}</td>
                <td>{item.avg_temp?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_humidity?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_soil_moisture?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_lux?.toFixed(2) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* MPPT Chart */}
      <section style={{ marginBottom: 50 }}>
        <h2>MPPT Data</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mpptData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg_pv_voltage"
              stroke="#008000"
              name="PV Voltage (V)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_pv_current"
              stroke="#800080"
              name="PV Current (A)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_battery_voltage"
              stroke="#FFA500"
              name="Battery Voltage (V)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_battery_current"
              stroke="#FF4500"
              name="Battery Current (A)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_load_voltage"
              stroke="#1E90FF"
              name="Load Voltage (V)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avg_load_current"
              stroke="#2E8B57"
              name="Load Current (A)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <table
          border="1"
          cellPadding="8"
          style={{ marginTop: 15, width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Hour</th>
              <th>PV Voltage (V)</th>
              <th>PV Current (A)</th>
              <th>Battery Voltage (V)</th>
              <th>Battery Current (A)</th>
              <th>Load Voltage (V)</th>
              <th>Load Current (A)</th>
            </tr>
          </thead>
          <tbody>
            {mpptData.map((item, i) => (
              <tr key={i}>
                <td>{item.hour}</td>
                <td>{item.avg_pv_voltage?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_pv_current?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_battery_voltage?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_battery_current?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_load_voltage?.toFixed(2) ?? "-"}</td>
                <td>{item.avg_load_current?.toFixed(2) ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
