// MockMate backend - entry point
// Ye file server start karti hai: database connect, routes jodna, errors handle karna.

import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

// 1. Zaroori .env values check karo, warna server start hi mat karo
const required = ["MONGO_URI", "JWT_SECRET"];
if (process.env.AI_MOCK !== "true") required.push("GEMINI_API_KEY");
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing in .env file: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

// 2. Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "200kb" }));

// 3. Routes
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

// 4. Koi route match nahi hua
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 5. Common error handler (Express 5 async errors bhi yahin aate hain)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Something went wrong on the server",
  });
});

// 6. Pehle DB connect, phir server start
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
