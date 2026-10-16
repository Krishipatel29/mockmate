import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  startInterview,
  submitInterview,
  listInterviews,
  getInterview,
  reviewWithAI,
} from "../controllers/interviewController.js";

const router = Router();

// Ye saare routes login ke baad hi chalenge
router.use(auth);

router.post("/start", startInterview);
router.post("/:id/submit", submitInterview);
router.post("/:id/review", reviewWithAI);
router.get("/", listInterviews);
router.get("/:id", getInterview);

export default router;
