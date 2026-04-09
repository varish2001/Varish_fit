export const macroPalette = {
  protein: "#ff6b35",
  carbs: "#38d39f",
  fats: "#101418"
};

export const formatGoalLabel = (goal) => {
  if (!goal) return "Maintenance";
  return goal
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const buildMacroChartData = (macros = {}) => {
  const total = (macros.protein || 0) + (macros.carbs || 0) + (macros.fats || 0);

  return [
    {
      key: "protein",
      label: "Protein",
      grams: macros.protein || 0,
      percentage: total ? Math.round(((macros.protein || 0) / total) * 100) : 0,
      color: macroPalette.protein
    },
    {
      key: "carbs",
      label: "Carbs",
      grams: macros.carbs || 0,
      percentage: total ? Math.round(((macros.carbs || 0) / total) * 100) : 0,
      color: macroPalette.carbs
    },
    {
      key: "fats",
      label: "Fats",
      grams: macros.fats || 0,
      percentage: total ? Math.round(((macros.fats || 0) / total) * 100) : 0,
      color: macroPalette.fats
    }
  ];
};

export const buildMealSections = (meals = {}) => [
  {
    key: "breakfast",
    title: "Breakfast",
    subtitle: "Fuel your morning",
    icon: "coffee",
    items: Array.isArray(meals.breakfast) ? meals.breakfast : []
  },
  {
    key: "lunch",
    title: "Lunch",
    subtitle: "Midday performance plate",
    icon: "utensils",
    items: Array.isArray(meals.lunch) ? meals.lunch : []
  },
  {
    key: "snack",
    title: "Snack",
    subtitle: "Stay energized",
    icon: "apple",
    items: Array.isArray(meals.snack) ? meals.snack : []
  },
  {
    key: "dinner",
    title: "Dinner",
    subtitle: "Recovery focused",
    icon: "moon",
    items: Array.isArray(meals.dinner) ? meals.dinner : []
  }
];

export const getMealTotals = (items = []) =>
  items.reduce(
    (acc, item) => ({
      protein: acc.protein + (item?.macros?.protein || 0),
      carbs: acc.carbs + (item?.macros?.carbs || 0),
      fats: acc.fats + (item?.macros?.fats || 0),
      calories: acc.calories + (item?.macros?.calories || 0)
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );
