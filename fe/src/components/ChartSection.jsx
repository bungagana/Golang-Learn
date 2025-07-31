
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const ChartSection = ({ title, data }) => {
  if (!data || data.length === 0) {
    return (
      <section className="chart-section">
        <h2>{title}</h2>
        <p>Tidak ada data untuk ditampilkan</p>
      </section>
    );
  }

  // Ambil semua kolom numeric untuk dijadikan line chart
  const allKeys = Object.keys(data[0] || {});
  const lineKeys = allKeys.filter(
    (key) => key !== "timestamp" && typeof data[0][key] === "number"
  );

  // Warna random untuk setiap line
  const colors = ["#ff5555", "#50fa7b", "#61dafb", "#ffb86c", "#bd93f9", "#8be9fd", "#f1fa8c"];

  return (
    <section className="chart-section">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Legend />
          {lineKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[idx % colors.length]}
              name={key}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default ChartSection;
