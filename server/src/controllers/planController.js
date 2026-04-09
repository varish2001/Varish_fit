import { DietPlan } from "../models/DietPlan.js";
import { WorkoutPlan } from "../models/WorkoutPlan.js";
import { generatePersonalizedPlans } from "../services/recommendationService.js";
import { buildDietPlan, normalizeDietProfile, shapeDietPlanResponse } from "../services/dietPlanService.js";
import { runtimeState } from "../config/runtime.js";
import { memoryStore } from "../store/memoryStore.js";

export const getWorkoutPlan = async (req, res) => {
  let plan = runtimeState.dbConnected
    ? await WorkoutPlan.findOne({ userId: req.user._id })
    : memoryStore.getWorkout(req.user._id);
  if (!plan) {
    const { workout, source } = await generatePersonalizedPlans(req.user);
    plan = runtimeState.dbConnected
      ? await WorkoutPlan.create({
          userId: req.user._id,
          goal: req.user.fitnessGoal,
          level: req.user.experienceLevel,
          weeklySchedule: workout
        })
      : memoryStore.upsertWorkout(req.user._id, {
          goal: req.user.fitnessGoal,
          level: req.user.experienceLevel,
          weeklySchedule: workout
        });
    const plain = typeof plan.toObject === "function" ? plan.toObject() : plan;
    return res.json({ ...plain, recommendationSource: source });
  }
  res.json(plan);
};

export const getDietPlan = async (req, res) => {
  let plan = runtimeState.dbConnected ? await DietPlan.findOne({ userId: req.user._id }) : memoryStore.getDiet(req.user._id);
  if (!plan) {
    const { diet, source } = await generatePersonalizedPlans(req.user);
    plan = runtimeState.dbConnected
      ? await DietPlan.create({
          userId: req.user._id,
          ...diet
        })
      : memoryStore.upsertDiet(req.user._id, diet);
    const plain = typeof plan.toObject === "function" ? plan.toObject() : plan;
    return res.json({ ...shapeDietPlanResponse(plain, req.user), recommendationSource: source });
  }
  const plain = typeof plan.toObject === "function" ? plan.toObject() : plan;
  res.json(shapeDietPlanResponse(plain, req.user));
};

export const regeneratePlans = async (req, res) => {
  const { workout, diet, source } = await generatePersonalizedPlans(req.user);

  const workoutPlan = runtimeState.dbConnected
    ? await WorkoutPlan.findOneAndUpdate(
        { userId: req.user._id },
        {
          goal: req.user.fitnessGoal,
          level: req.user.experienceLevel,
          weeklySchedule: workout
        },
        { upsert: true, new: true }
      )
    : memoryStore.upsertWorkout(req.user._id, {
        goal: req.user.fitnessGoal,
        level: req.user.experienceLevel,
        weeklySchedule: workout
      });

  const dietPlan = runtimeState.dbConnected
    ? await DietPlan.findOneAndUpdate(
        { userId: req.user._id },
        {
          ...diet
        },
        { upsert: true, new: true }
      )
    : memoryStore.upsertDiet(req.user._id, diet);

  const plainDiet = typeof dietPlan?.toObject === "function" ? dietPlan.toObject() : dietPlan;
  res.json({ workoutPlan, dietPlan: shapeDietPlanResponse(plainDiet, req.user), recommendationSource: source });
};

export const createDietPlan = async (req, res) => {
  try {
    const profile = normalizeDietProfile({
      ...req.user,
      ...req.body
    });
    const plan = buildDietPlan(profile);
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message || "Unable to generate diet plan." });
  }
};
