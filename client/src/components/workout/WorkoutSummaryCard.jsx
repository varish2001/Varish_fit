export default function WorkoutSummaryCard({ icon: Icon, label, value, tone = "coral" }) {
  const toneClass = tone === "mint" ? "text-mint bg-mint/10" : tone === "ink" ? "text-ink bg-slate/10" : "text-coral bg-coral/10";

  return (
    <div className="glass p-5">
      <div className={`mb-4 inline-flex rounded-2xl p-3 ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate/60">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
