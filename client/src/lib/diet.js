import { api } from "./api";

const buildDietPayload = (user) => ({
  age: Number(user?.age),
  height: Number(user?.heightCm ?? user?.height),
  weight: Number(user?.weightKg ?? user?.weight),
  gender: user?.gender,
  goal: user?.fitnessGoal ?? user?.goal,
  activityLevel: user?.activityLevel ?? user?.experienceLevel,
  dietPreference: user?.dietPreference
});

export const fetchDietPlan = async (user) => {
  const { data } = await api.post("/diet-plan", buildDietPayload(user));
  return data;
};

export const regenerateDietPlan = async () => {
  const { data } = await api.post("/plans/regenerate");
  return data?.dietPlan;
};
