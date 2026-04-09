import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Droplets, Flame, Target, Weight } from "lucide-react";
import { api } from "../lib/api";

export default function DashboardPage() {
  const [workout, setWorkout] = useState(null);
  const [diet, setDiet] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logInput, setLogInput] = useState({ caloriesBurned: 250, workoutsCompleted: 1, weightKg: "" });

  useEffect(() => {
    const load = async () => {
      const [w, d, l] = await Promise.all([api.get("/plans/workout"), api.get("/plans/diet"), api.get("/tracking/logs")]);
      setWorkout(w.data);
      setDiet(d.data);
      setLogs(l.data);
    };
    load();
  }, []);

  const latest = logs[logs.length - 1];

  const updateTodayLog = async () => {
    await api.post("/tracking/today", {
      waterIntakeMl: latest?.waterIntakeMl || 0,
      caloriesBurned: Number(logInput.caloriesBurned),
      workoutsCompleted: Number(logInput.workoutsCompleted),
      weightKg: logInput.weightKg ? Number(logInput.weightKg) : undefined
    });
    const refreshed = await api.get("/tracking/logs");
    setLogs(refreshed.data);
  };

  const hydrationTarget = diet?.hydration ?? diet?.hydrationMl;

  const cards = [
    { label: "Daily Calories", value: diet?.calories || "-", icon: Flame },
    { label: "Hydration Target", value: `${hydrationTarget ?? "-"} ml`, icon: Droplets },
    { label: "Workout Days", value: workout?.weeklySchedule?.length || "-", icon: Target },
    { label: "Latest Weight", value: latest?.weightKg ? `${latest.weightKg} kg` : "-", icon: Weight }
  ];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-ink">Your Fitness Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="glass p-4">
            <card.icon className="mb-3 text-coral" />
            <p className="text-sm text-slate">{card.label}</p>
            <p className="text-2xl font-bold text-ink">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink to="/workout" title="Workout Plan" subtitle="View your split and sets/reps" />
        <QuickLink to="/diet" title="Diet Plan" subtitle="See calories and macro targets" />
        <QuickLink to="/posture" title="Posture Detection" subtitle="Live camera-based exercise feedback" />
      </div>
      <div className="glass p-5">
        <h2 className="text-xl font-bold text-ink">Log Today&apos;s Progress</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <input
            className="rounded-xl border border-slate/20 bg-white px-3 py-2"
            type="number"
            placeholder="Calories burned"
            value={logInput.caloriesBurned}
            onChange={(e) => setLogInput((p) => ({ ...p, caloriesBurned: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate/20 bg-white px-3 py-2"
            type="number"
            placeholder="Workouts"
            value={logInput.workoutsCompleted}
            onChange={(e) => setLogInput((p) => ({ ...p, workoutsCompleted: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate/20 bg-white px-3 py-2"
            type="number"
            placeholder="Weight (kg)"
            value={logInput.weightKg}
            onChange={(e) => setLogInput((p) => ({ ...p, weightKg: e.target.value }))}
          />
          <button onClick={updateTodayLog} className="rounded-xl bg-coral px-4 py-2 font-semibold text-white">
            Save Log
          </button>
        </div>
      </div>
    </section>
  );
}

function QuickLink({ to, title, subtitle }) {
  return (
    <Link to={to} className="glass p-5 transition hover:-translate-y-0.5">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate">{subtitle}</p>
    </Link>
  );
}
