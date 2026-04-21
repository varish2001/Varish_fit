import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Dumbbell, Flame, HeartPulse, RefreshCw, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import WorkoutActions from "../components/workout/WorkoutActions";
import WorkoutDayCard from "../components/workout/WorkoutDayCard";
import WorkoutSummaryCard from "../components/workout/WorkoutSummaryCard";
import { fetchWorkoutPlan, generateWorkoutPlan, normalizeWorkoutDays } from "../lib/workout";

export default function WorkoutPage() {
  const { user, refreshUser } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDay, setOpenDay] = useState(0);

  const loadPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWorkoutPlan();
      setPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your workout plan right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const runAction = async (payload = {}) => {
    setActionLoading(true);
    setError("");
    try {
      const data = await generateWorkoutPlan(payload);
      setPlan(data);
      setOpenDay(0);
      await refreshUser?.();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate a new workout plan.");
    } finally {
      setActionLoading(false);
    }
  };

  const days = useMemo(() => normalizeWorkoutDays(plan), [plan]);
  const currentGoal = plan?.goalKey || user?.fitnessGoal || "maintenance";
  const isBusy = loading || actionLoading;

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="glass p-6">
          <RefreshCw className="h-6 w-6 animate-spin text-coral" />
          <p className="mt-3 font-semibold text-ink">Building your trainer-level workout plan...</p>
          <p className="mt-1 text-sm text-slate">Matching your goal, level, weekly schedule, and equipment.</p>
        </div>
      </section>
    );
  }

  if (error && !plan) {
    return (
      <section className="glass p-6">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="mt-0.5 h-5 w-5" />
          <div>
            <h1 className="text-xl font-bold">Workout plan unavailable</h1>
            <p className="mt-2 text-sm">{error}</p>
            <button onClick={loadPlan} className="mt-4 rounded-xl bg-coral px-4 py-2 font-semibold text-white">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="glass overflow-hidden bg-[linear-gradient(135deg,_rgba(16,20,24,0.96),_rgba(25,34,45,0.92)),radial-gradient(circle_at_top_right,_rgba(255,107,53,0.26),_transparent_30%)] p-6 text-white md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <Dumbbell className="h-4 w-4" />
              {plan?.goal || "Personalized Plan"}
            </span>
            <h1 className="mt-5 text-3xl font-bold md:text-5xl">Professional Workout Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
              A structured plan built from your goal, training level, schedule, and equipment preference.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Current Split</p>
            <p className="mt-2 text-2xl font-bold">{plan?.split || "Balanced Fitness Split"}</p>
          </div>
        </div>
      </div>

      <WorkoutActions
        goal={currentGoal}
        loading={isBusy}
        onRegenerate={() => runAction()}
        onGoalChange={(fitnessGoal) => runAction({ fitnessGoal })}
        onSimpler={() => runAction({ experienceLevel: "beginner", fitnessGoal: "beginner_fitness" })}
        onEquipment={(equipmentPreference) => runAction({ equipmentPreference })}
      />

      {error && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{error}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkoutSummaryCard icon={Target} label="Goal" value={plan?.goal || "-"} />
        <WorkoutSummaryCard icon={CalendarDays} label="Training Days" value={`${days.length || 0} / week`} tone="mint" />
        <WorkoutSummaryCard icon={Dumbbell} label="Equipment" value={plan?.equipmentPreference === "home" ? "Home" : "Gym"} tone="ink" />
        <WorkoutSummaryCard icon={Flame} label="Level" value={plan?.experienceLevel || user?.experienceLevel || "-"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TrainerNote title="Warm-Up" body={plan?.warmUp} />
        <TrainerNote title="Progressive Overload" body={plan?.progressiveOverload} />
        <TrainerNote title="Cool-Down" body={plan?.coolDown} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.42fr]">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">Weekly Split</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Expandable training days</h2>
          </div>
          {days.length ? (
            days.map((day, index) => (
              <WorkoutDayCard
                key={`${day.day}-${day.focus || day.muscleGroup}`}
                day={day}
                open={openDay === index}
                onToggle={() => setOpenDay((prev) => (prev === index ? -1 : index))}
              />
            ))
          ) : (
            <div className="glass p-6 text-slate">No workout days were generated. Regenerate your plan to try again.</div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass p-5">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-coral" />
              <h2 className="text-lg font-bold text-ink">Recovery Tips</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate">
              {(plan?.recoveryTips || []).map((tip) => (
                <li key={tip} className="rounded-xl bg-white p-3 shadow-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate/60">Rest Days</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(plan?.restDays || []).map((day) => (
                <span key={day} className="rounded-full bg-mint/10 px-3 py-2 text-sm font-semibold text-emerald-700">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function TrainerNote({ title, body }) {
  return (
    <div className="glass p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate/60">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate">{body || "Follow clean technique and keep the session controlled."}</p>
    </div>
  );
}
