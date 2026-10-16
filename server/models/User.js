import mongoose from "mongoose";

// User collection: ek document = ek registered user
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // bcrypt se hash karke save hota hai
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
