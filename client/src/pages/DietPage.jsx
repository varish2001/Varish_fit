import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Droplets, Flame, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchDietPlan, regenerateDietPlan } from "../lib/diet";
import MacroBreakdownCard from "../components/diet/MacroBreakdownCard";
import DietSummaryCard from "../components/diet/DietSummaryCard";
import MealSlotCard from "../components/diet/MealSlotCard";
import DietSkeleton from "../components/diet/DietSkeleton";
import { buildMacroChartData, buildMealSections, formatGoalLabel } from "../utils/diet";

export default function DietPage() {
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  const loadPlan = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchDietPlan(user);
      setPlan(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your personalized diet plan right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadPlan();
  }, [authLoading, user]);

  const macroChartData = useMemo(() => buildMacroChartData(plan?.macros), [plan]);
  const mealSections = useMemo(() => buildMealSections(plan?.meals), [plan]);
  const hydrationProgress = plan ? Math.min(100, Math.round((plan.hydration / 4000) * 100)) : 0;

  const onRegenerate = async () => {
    setRegenerating(true);
    setError("");
    try {
      const nextPlan = await regenerateDietPlan();
      setPlan(nextPlan);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to regenerate your diet plan.");
    } finally {
      setRegenerating(false);
    }
  };

  const onDownload = () => {
    window.print();
  };

  if (authLoading || loading) return <DietSkeleton />;

  if (error && !plan) {
    return (
      <section className="glass p-6">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="mt-0.5 h-5 w-5" />
          <div>
            <h1 className="text-xl font-bold">Diet plan unavailable</h1>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="glass overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.18),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.97),_rgba(247,250,252,0.9))] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <Sparkles className="h-4 w-4" />
              Personalized Nutrition
            </div>
            <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">Diet & Nutrition Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
              Built from your profile, goal, and activity level to keep your meals practical, Indian-friendly, and performance focused.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-coral/20 bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
              Goal: {plan?.goalLabel || formatGoalLabel(plan?.goal)}
            </span>
            <span className="rounded-full border border-mint/20 bg-mint/10 px-4 py-2 text-sm font-semibold text-emerald-700">
              {plan?.dietPreference === "non_veg" ? "Non-Veg Plan" : "Veg Plan"}
            </span>
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
              {regenerating ? "Regenerating..." : "Regenerate Diet Plan"}
            </button>
            <button
              onClick={onDownload}
              className="rounded-full border border-slate/15 bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              Download Plan (PDF)
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{error}</p>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <DietSummaryCard
            icon={Flame}
            eyebrow="Daily Energy"
            value={`${plan?.calories} kcal`}
            title="Calorie target aligned to your current goal"
            accent="from-coral/20 via-white to-white"
          />
          <div className="glass overflow-hidden bg-gradient-to-br from-mint/15 via-white to-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">Hydration</p>
                <p className="mt-2 text-3xl font-bold text-ink">{plan?.hydration} ml</p>
                <p className="mt-1 text-sm text-slate">Daily hydration target</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                <Droplets className="h-6 w-6 text-mint" />
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate">
                <span>Target progress</span>
                <span>{hydrationProgress}% planned</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-mint/15">
                <div className="h-full rounded-full bg-gradient-to-r from-mint to-cyan-400" style={{ width: `${hydrationProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="glass p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">Profile Drivers</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric label="Age" value={`${user?.age} yrs`} />
            <Metric label="Height" value={`${user?.heightCm} cm`} />
            <Metric label="Weight" value={`${user?.weightKg} kg`} />
            <Metric label="Activity" value={formatGoalLabel(user?.activityLevel || user?.experienceLevel)} />
          </div>
        </div>
      </div>

      <MacroBreakdownCard chartData={macroChartData} totalCalories={plan?.calories} />

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">Meal Structure</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Your day, broken into simple wins</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {mealSections.map((section) => (
            <MealSlotCard key={section.key} {...section} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate/10 bg-white/80 px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate/60">{label}</p>
      <p className="mt-2 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}
