import OpenAI from "openai";
import { buildDietPlan, normalizeDietProfile, shapeDietPlanResponse } from "./dietPlanService.js";

const exerciseLibrary = {
  Chest: ["Push-Ups", "Dumbbell Bench Press", "Incline Press"],
  Back: ["Lat Pulldown", "Seated Row", "Deadlift"],
  Legs: ["Squat", "Leg Press", "Romanian Deadlift"],
  Shoulders: ["Overhead Press", "Lateral Raise", "Rear Delt Fly"],
  Arms: ["Bicep Curl", "Tricep Pushdown", "Hammer Curl"],
  Core: ["Plank", "Hanging Knee Raise", "Russian Twist"]
};

const repsByLevel = {
  beginner: { sets: 3, reps: "10-12" },
  intermediate: { sets: 4, reps: "8-12" },
  advanced: { sets: 5, reps: "6-10" }
};

const splitTemplates = {
  beginner: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"],
  intermediate: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"],
  advanced: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"]
};

export const buildWorkoutPlan = (user) => {
  const split = splitTemplates[user.experienceLevel] || splitTemplates.beginner;
  const volume = repsByLevel[user.experienceLevel] || repsByLevel.beginner;
  return split.map((muscle, index) => ({
    day: `Day ${index + 1}`,
    muscleGroup: muscle,
    exercises: (exerciseLibrary[muscle] || []).map((name) => ({
      name,
      sets: volume.sets,
      reps: volume.reps,
      notes: `Controlled tempo. Focus on form for ${name}.`,
      imageUrl: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
    }))
  }));
};

const openaiClient =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key"
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const toString = (value, fallback = "") => (typeof value === "string" && value.trim() ? value.trim() : fallback);
const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeWorkout = (rawWorkout, fallbackWorkout) => {
  if (!Array.isArray(rawWorkout) || rawWorkout.length === 0) return fallbackWorkout;
  return rawWorkout.slice(0, 7).map((day, index) => ({
    day: toString(day?.day, `Day ${index + 1}`),
    muscleGroup: toString(day?.muscleGroup, "Full Body"),
    exercises: Array.isArray(day?.exercises) && day.exercises.length
      ? day.exercises.slice(0, 8).map((ex) => ({
          name: toString(ex?.name, "Exercise"),
          sets: Math.max(1, toNumber(ex?.sets, 3)),
          reps: toString(ex?.reps, "10-12"),
          notes: toString(ex?.notes, "Use controlled movement and correct form."),
          imageUrl:
            toString(ex?.imageUrl) || "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
        }))
      : fallbackWorkout[index % fallbackWorkout.length]?.exercises || []
  }));
};

const normalizeDiet = (rawDiet, fallbackDiet, user) => {
  const profile = normalizeDietProfile(user);
  const shaped = shapeDietPlanResponse(
    {
      calories: Math.max(1200, toNumber(rawDiet?.calories, fallbackDiet.calories)),
      hydration:
        Math.max(
          1200,
          toNumber(rawDiet?.hydration, toNumber(rawDiet?.hydrationMl, fallbackDiet.hydration))
        ) || fallbackDiet.hydration,
      goal: rawDiet?.goal || profile.goal,
      dietPreference: rawDiet?.dietPreference || profile.dietPreference,
      macros: {
        protein: Math.max(40, toNumber(rawDiet?.macros?.protein, fallbackDiet.macros.protein)),
        carbs: Math.max(50, toNumber(rawDiet?.macros?.carbs, fallbackDiet.macros.carbs)),
        fats: Math.max(20, toNumber(rawDiet?.macros?.fats, fallbackDiet.macros.fats))
      },
      meals: {
        breakfast: Array.isArray(rawDiet?.meals?.breakfast)
          ? rawDiet.meals.breakfast.slice(0, 6).map((item) =>
              typeof item === "string"
                ? item
                : {
                    name: toString(item?.name, "Healthy breakfast"),
                    quantity: toString(item?.quantity, "1 serving"),
                    portion: toString(item?.portion, "Standard portion"),
                    macros: {
                      protein: Math.max(0, toNumber(item?.macros?.protein, 0)),
                      carbs: Math.max(0, toNumber(item?.macros?.carbs, 0)),
                      fats: Math.max(0, toNumber(item?.macros?.fats, 0)),
                      calories: Math.max(0, toNumber(item?.macros?.calories, 0))
                    }
                  }
            )
          : fallbackDiet.meals.breakfast,
        lunch: Array.isArray(rawDiet?.meals?.lunch)
          ? rawDiet.meals.lunch.slice(0, 6).map((item) =>
              typeof item === "string"
                ? item
                : {
                    name: toString(item?.name, "Balanced lunch"),
                    quantity: toString(item?.quantity, "1 serving"),
                    portion: toString(item?.portion, "Standard portion"),
                    macros: {
                      protein: Math.max(0, toNumber(item?.macros?.protein, 0)),
                      carbs: Math.max(0, toNumber(item?.macros?.carbs, 0)),
                      fats: Math.max(0, toNumber(item?.macros?.fats, 0)),
                      calories: Math.max(0, toNumber(item?.macros?.calories, 0))
                    }
                  }
            )
          : fallbackDiet.meals.lunch,
        snack: Array.isArray(rawDiet?.meals?.snack)
          ? rawDiet.meals.snack.slice(0, 6).map((item) =>
              typeof item === "string"
                ? item
                : {
                    name: toString(item?.name, "Smart snack"),
                    quantity: toString(item?.quantity, "1 serving"),
                    portion: toString(item?.portion, "Standard portion"),
                    macros: {
                      protein: Math.max(0, toNumber(item?.macros?.protein, 0)),
                      carbs: Math.max(0, toNumber(item?.macros?.carbs, 0)),
                      fats: Math.max(0, toNumber(item?.macros?.fats, 0)),
                      calories: Math.max(0, toNumber(item?.macros?.calories, 0))
                    }
                  }
            )
          : fallbackDiet.meals.snack,
        dinner: Array.isArray(rawDiet?.meals?.dinner)
          ? rawDiet.meals.dinner.slice(0, 6).map((item) =>
              typeof item === "string"
                ? item
                : {
                    name: toString(item?.name, "Light dinner"),
                    quantity: toString(item?.quantity, "1 serving"),
                    portion: toString(item?.portion, "Standard portion"),
                    macros: {
                      protein: Math.max(0, toNumber(item?.macros?.protein, 0)),
                      carbs: Math.max(0, toNumber(item?.macros?.carbs, 0)),
                      fats: Math.max(0, toNumber(item?.macros?.fats, 0)),
                      calories: Math.max(0, toNumber(item?.macros?.calories, 0))
                    }
                  }
            )
          : fallbackDiet.meals.dinner
      }
    },
    profile
  );

  return shaped;
};

const aiPrompt = (user, fallbackDiet) => `
Create a personalized weekly workout plan and daily diet plan for this user:
- age: ${user.age}
- gender: ${user.gender}
- heightCm: ${user.heightCm}
- weightKg: ${user.weightKg}
- fitnessGoal: ${user.fitnessGoal}
- experienceLevel: ${user.experienceLevel}
- activityLevel: ${user.activityLevel || user.experienceLevel}
- dietPreference: ${user.dietPreference || "veg"}
- estimatedDailyCalories: ${fallbackDiet.calories}
- hydrationMlTarget: ${fallbackDiet.hydration}

Return strict JSON only with this schema:
{
  "workoutPlan": [
    {
      "day": "Day 1",
      "muscleGroup": "Chest",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "notes": "Short coaching note",
          "imageUrl": "https://..."
        }
      ]
    }
  ],
  "dietPlan": {
    "calories": 2200,
    "hydration": 2600,
    "macros": { "protein": 160, "carbs": 220, "fats": 70 },
    "goal": "muscle_gain",
    "dietPreference": "veg",
    "meals": {
      "breakfast": [{ "name": "item1", "quantity": "1 bowl", "portion": "200 g", "macros": { "protein": 18, "carbs": 25, "fats": 7, "calories": 230 } }],
      "lunch": [{ "name": "item1", "quantity": "1 plate", "portion": "250 g", "macros": { "protein": 32, "carbs": 40, "fats": 11, "calories": 380 } }],
      "snack": [{ "name": "item1", "quantity": "1 serving", "portion": "150 g", "macros": { "protein": 15, "carbs": 18, "fats": 5, "calories": 170 } }],
      "dinner": [{ "name": "item1", "quantity": "1 plate", "portion": "220 g", "macros": { "protein": 28, "carbs": 26, "fats": 10, "calories": 300 } }]
    }
  }
}

Rules:
- Plans must match goal and experience.
- Avoid unsafe advice.
- Keep exercises beginner/intermediate safe when level is low.
- Keep meal items realistic and common.
`;

export const generatePersonalizedPlans = async (user) => {
  const fallbackWorkout = buildWorkoutPlan(user);
  const fallbackDiet = buildDietPlan(user);

  if (!openaiClient) {
    return { workout: fallbackWorkout, diet: fallbackDiet, source: "rule_based" };
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_PLAN_MODEL || "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert fitness coach and nutrition planner. Return only valid JSON and nothing else."
        },
        { role: "user", content: aiPrompt(user, fallbackDiet) }
      ]
    });

    const content = response.choices?.[0]?.message?.content || "{}";
    const parsed = safeJsonParse(content) || {};
    const workout = normalizeWorkout(parsed.workoutPlan, fallbackWorkout);
    const diet = normalizeDiet(parsed.dietPlan, fallbackDiet, user);
    return { workout, diet, source: "ai" };
  } catch (error) {
    console.warn("AI recommendation failed, falling back to rule-based plans:", error.message);
    return { workout: fallbackWorkout, diet: fallbackDiet, source: "rule_based_fallback" };
  }
};
