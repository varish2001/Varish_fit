export default function DietSummaryCard({ icon: Icon, eyebrow, title, value, accent = "from-coral/15 to-white" }) {
  return (
    <div className={`glass overflow-hidden p-5 bg-gradient-to-br ${accent}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/70">{eyebrow}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          <p className="mt-1 text-sm text-slate">{title}</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
          <Icon className="h-6 w-6 text-coral" />
        </div>
      </div>
    </div>
  );
}
