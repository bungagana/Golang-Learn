import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Tooltip custom biar bisa scroll
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(30,30,30,0.95)",
          padding: "10px",
          borderRadius: "8px",
          maxHeight: "200px",
          overflowY: "auto",
          fontSize: "13px"
        }}
      >
        <p style={{ color: "#fff", marginBottom: "5px" }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color, margin: "2px 0" }}>
            {entry.name} : <b>{entry.value}</b>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartSection = ({ title, data }) => {
  if (!data || data.length === 0) {
    return (
      <section className="chart-section">
        <h2>{title}</h2>
        <p>Tidak ada data untuk ditampilkan</p>
      </section>
    );
  }

  // Ambil semua key numeric
  const allKeys = Object.keys(data[0] || {});
  const lineKeys = allKeys.filter(
    (key) => key !== "timestamp" && typeof data[0][key] === "number"
  );

  // Tentukan warna konsisten untuk tiap key
  const colors = [
    "#ff5555", "#50fa7b", "#61dafb", "#ffb86c",
    "#bd93f9", "#8be9fd", "#f1fa8c", "#ff79c6",
    "#ff9966", "#00e676", "#ffcc00", "#00bcd4", "#e91e63"
  ];

  // Cari min & max value tiap key untuk group ke sumbu kiri/kanan
  const ranges = {};
  lineKeys.forEach((key) => {
    const values = data.map((d) => d[key]).filter((v) => typeof v === "number");
    const min = Math.min(...values);
    const max = Math.max(...values);
    ranges[key] = { min, max, range: max - min };
  });

  // Group otomatis ke Y kiri (range kecil) / kanan (range besar)
  // threshold bisa diubah misalnya range > 1000 taruh di kanan
  const assignYAxis = (key) => {
    if (ranges[key].range > 1000) return "right"; // range besar → kanan
    return "left"; // default → kiri
  };

  return (
    <section className="chart-section">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#aaa" minTickGap={25} />
          <YAxis yAxisId="left" stroke="#aaa" />
          <YAxis yAxisId="right" orientation="right" stroke="#aaa" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
  layout="horizontal"
  verticalAlign="bottom"
  align="left"
  wrapperStyle={{
    display: "flex",
    flexWrap: "wrap",
    rowGap: "4px",
    columnGap: "10px",
    paddingTop: "10px",
    fontSize: "12px",
    maxWidth: "100%",
  }}
/>


          {/* Gambar semua line dengan yAxisId otomatis */}
          {lineKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[idx % colors.length]}
              name={key}
              dot={false}
              strokeWidth={1.5}
              yAxisId={assignYAxis(key)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default ChartSection;
