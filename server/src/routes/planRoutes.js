import express from "express";
import { createDietPlan, getDietPlan, getWorkoutPlan, regeneratePlans } from "../controllers/planController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/workout", protect, getWorkoutPlan);
router.get("/diet", protect, getDietPlan);
router.post("/diet-plan", protect, createDietPlan);
router.post("/regenerate", protect, regeneratePlans);

export default router;
