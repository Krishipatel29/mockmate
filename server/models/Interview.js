import mongoose from "mongoose";

// Ek question aur uska result (interview ke andar array mein rehta hai)
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    score: { type: Number, default: null }, // 0 to 10, AI deta hai
    feedback: { type: String, default: "" },
    idealAnswer: { type: String, default: "" },
  },
  { _id: false }
);

// Interview collection: ek document = ek mock interview session
const interviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    questions: [questionSchema],
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
    totalScore: { type: Number, default: null }, // percentage (0 to 100)
    overallFeedback: { type: String, default: "" },
    // Questions kahan se aaye: "ai" ya "practice" (Plan B question bank)
    questionSource: { type: String, enum: ["ai", "practice"], default: "ai" },
    // Answers kisne check kiye: "ai" ya "basic" (Plan B scoring)
    reviewedBy: { type: String, enum: ["ai", "basic", null], default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
