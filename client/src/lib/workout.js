import { api } from "./api";

export const goalOptions = [
  ["muscle_gain", "Muscle Gain"],
  ["fat_loss", "Fat Loss"],
  ["strength", "Strength"],
  ["endurance", "Endurance"],
  ["beginner_fitness", "Beginner Fitness"],
  ["maintenance", "General Fitness"]
];

export const fetchWorkoutPlan = async () => {
  const { data } = await api.get("/plans/workout");
  return data;
};

export const generateWorkoutPlan = async (payload = {}) => {
  const { data } = await api.post("/workout-plan", payload);
  return data;
};

export const normalizeWorkoutDays = (plan) => plan?.weeklyPlan || plan?.weeklySchedule || [];
