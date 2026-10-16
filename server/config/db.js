import mongoose from "mongoose";

// MongoDB Atlas se connection banata hai (URI .env file mein hai)
export default async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}
