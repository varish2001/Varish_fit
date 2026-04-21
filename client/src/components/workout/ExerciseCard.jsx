export default function ExerciseCard({ exercise }) {
  return (
    <div className="rounded-2xl border border-slate/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink">{exercise.name}</h3>
          <p className="mt-1 text-sm text-slate">{exercise.muscleTargeted || "Full Body"}</p>
        </div>
        <span className="rounded-full bg-fog px-3 py-1 text-xs font-semibold capitalize text-slate">
          {exercise.difficulty || "beginner"}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <Metric label="Sets" value={exercise.sets || "-"} />
        <Metric label="Reps" value={exercise.reps || "-"} />
        <Metric label="Rest" value={exercise.rest || "60 sec"} />
      </div>
      <p className="mt-4 rounded-xl bg-coral/10 p-3 text-sm leading-6 text-slate">
        {exercise.tips || exercise.notes || "Move with control and keep clean form."}
      </p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-fog px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate/60">{label}</p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  );
}
