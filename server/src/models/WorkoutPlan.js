import mongoose from "mongoose";

const workoutDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    muscleGroup: { type: String, required: true },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: String,
        notes: String,
        imageUrl: String
      }
    ]
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: String, required: true },
    level: { type: String, required: true },
    weeklySchedule: [workoutDaySchema]
  },
  { timestamps: true }
);

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
