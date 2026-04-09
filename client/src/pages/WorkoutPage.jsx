import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function WorkoutPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/plans/workout").then(({ data }) => {
      setPlan(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading workout plan...</div>;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink">Workout Plan</h1>
      </div>
      <div className="grid gap-4">
        {plan?.weeklySchedule?.map((day) => (
          <article key={day.day} className="glass p-5">
            <h2 className="text-xl font-bold text-ink">
              {day.day} - {day.muscleGroup}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {day.exercises.map((ex) => (
                <div key={ex.name} className="rounded-xl border border-slate/10 bg-white p-3">
                  <img src={ex.imageUrl} alt={ex.name} className="h-24 w-full rounded-lg object-cover" />
                  <p className="mt-2 font-semibold text-ink">{ex.name}</p>
                  <p className="text-sm text-slate">
                    {ex.sets} sets x {ex.reps}
                  </p>
                  <p className="mt-1 text-xs text-slate">{ex.notes}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
