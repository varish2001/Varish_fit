import { Home, RefreshCw, Sparkles, Warehouse } from "lucide-react";
import { goalOptions } from "../../lib/workout";

export default function WorkoutActions({ goal, loading, onGoalChange, onRegenerate, onSimpler, onEquipment }) {
  return (
    <div className="glass p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate">
          Switch Goal
          <select
            value={goal || "maintenance"}
            onChange={(event) => onGoalChange(event.target.value)}
            disabled={loading}
            className="rounded-xl border border-slate/15 bg-white px-3 py-3 outline-none ring-coral focus:ring-2"
          >
            {goalOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <ActionButton icon={RefreshCw} label="Regenerate Plan" loading={loading} onClick={onRegenerate} />
          <ActionButton icon={Sparkles} label="Beginner Simpler Version" loading={loading} onClick={onSimpler} />
          <ActionButton icon={Home} label="Home Workout Version" loading={loading} onClick={() => onEquipment("home")} />
          <ActionButton icon={Warehouse} label="Gym Workout Version" loading={loading} onClick={() => onEquipment("gym")} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, loading, onClick }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate disabled:opacity-60"
    >
      <Icon className={`h-4 w-4 ${loading && label === "Regenerate Plan" ? "animate-spin" : ""}`} />
      {label}
    </button>
  );
}
