import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const ChartSection = ({ title, data, lines }) => (
  <section className="chart-section">
    <h2>{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

export default ChartSection;
