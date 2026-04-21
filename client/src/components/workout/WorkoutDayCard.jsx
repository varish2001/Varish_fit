import { ChevronDown } from "lucide-react";
import ExerciseCard from "./ExerciseCard";

export default function WorkoutDayCard({ day, open, onToggle }) {
  return (
    <article className="glass overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        type="button"
      >
        <div>
          <p className="text-sm font-semibold text-coral">{day.day}</p>
          <h2 className="text-xl font-bold text-ink">{day.focus || day.muscleGroup}</h2>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="grid gap-3 border-t border-slate/10 p-5 md:grid-cols-2 xl:grid-cols-3">
          {(day.exercises || []).map((exercise) => (
            <ExerciseCard key={`${day.day}-${exercise.name}`} exercise={exercise} />
          ))}
        </div>
      )}
    </article>
  );
}
