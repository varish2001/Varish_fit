import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { api } from "../lib/api";

export default function AnalyticsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/tracking/logs").then(({ data }) => setLogs(data));
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-ink">Progress Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass h-80 p-4">
          <h2 className="mb-3 text-lg font-semibold">Weight Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weightKg" stroke="#ff6b35" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass h-80 p-4">
          <h2 className="mb-3 text-lg font-semibold">Calories Burned</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={logs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="caloriesBurned" fill="#38d39f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
