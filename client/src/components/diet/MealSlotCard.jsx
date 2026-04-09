import { Apple, Coffee, MoonStar, UtensilsCrossed } from "lucide-react";
import { getMealTotals } from "../../utils/diet";

const iconMap = {
  coffee: Coffee,
  utensils: UtensilsCrossed,
  apple: Apple,
  moon: MoonStar
};

export default function MealSlotCard({ title, subtitle, icon, items }) {
  const Icon = iconMap[icon] || UtensilsCrossed;
  const totals = getMealTotals(items);

  return (
    <article className="glass group p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-coral/10 p-3 text-coral transition group-hover:bg-coral group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-slate">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={`${item.name}-${item.quantity}-${item.portion}`}
            className="rounded-2xl border border-slate/10 bg-white/80 px-4 py-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="mt-1 text-xs text-slate">{item.quantity} | {item.portion}</p>
              </div>
              <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">
                {item.macros.calories} kcal
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate">
              <MacroChip label="P" value={`${item.macros.protein}g`} />
              <MacroChip label="C" value={`${item.macros.carbs}g`} />
              <MacroChip label="F" value={`${item.macros.fats}g`} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-2xl bg-ink px-4 py-3 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Meal Totals</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span>{totals.calories} kcal</span>
          <span>{totals.protein}g protein</span>
          <span>{totals.carbs}g carbs</span>
          <span>{totals.fats}g fats</span>
        </div>
      </div>
    </article>
  );
}

function MacroChip({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="font-semibold text-ink">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
