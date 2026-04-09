import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function HydrationPage() {
  const [diet, setDiet] = useState(null);
  const [todayLog, setTodayLog] = useState(null);

  const load = async () => {
    const [d, logs] = await Promise.all([api.get("/plans/diet"), api.get("/tracking/logs")]);
    setDiet(d.data);
    setTodayLog(logs.data[logs.data.length - 1] || { waterIntakeMl: 0 });
  };

  useEffect(() => {
    load();
  }, []);

  const addWater = async (amountMl) => {
    const { data } = await api.post("/tracking/water", { amountMl });
    setTodayLog(data);
  };

  const hydrationTarget = diet?.hydration ?? diet?.hydrationMl;
  const progress = hydrationTarget ? Math.min(100, Math.round(((todayLog?.waterIntakeMl || 0) / hydrationTarget) * 100)) : 0;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-ink">Hydration Tracker</h1>
      <div className="glass p-6">
        <p className="text-sm text-slate">Today&apos;s Water Intake</p>
        <p className="text-3xl font-bold text-ink">{todayLog?.waterIntakeMl || 0} ml</p>
        <p className="text-sm text-slate">Target: {hydrationTarget || "-"} ml</p>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate/20">
          <div className="h-full bg-mint transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate">{progress}% completed</p>
        <div className="mt-4 flex gap-3">
          <button onClick={() => addWater(250)} className="rounded-lg bg-coral px-4 py-2 text-white">
            +250 ml
          </button>
          <button onClick={() => addWater(500)} className="rounded-lg bg-slate px-4 py-2 text-white">
            +500 ml
          </button>
        </div>
      </div>
    </section>
  );
}
