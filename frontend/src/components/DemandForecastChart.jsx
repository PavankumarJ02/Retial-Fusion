import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DemandForecastChart({ forecasts = [] }) {

  const chartData = useMemo(() => {
    if (!forecasts.length) return [];
    const maxDays = Math.max(...forecasts.map(f => f.forecast?.length || 0));
    return Array.from({ length: maxDays }).map((_, i) => {
      const row = { day: `Day ${i + 1}` };
      forecasts.forEach(f => {
        row[f.sku] = f.forecast?.[i] ?? 0;
      });
      return row;
    });
  }, [forecasts]);

  return (
    <div className="bg-slate-900 p-6 rounded-xl">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="day"/>
          <YAxis/>
          <Tooltip/>
          <Legend/>
          {forecasts.map((f,i)=>(
            <Line key={f.sku} type="monotone" dataKey={f.sku} stroke="#06b6d4"/>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}