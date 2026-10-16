import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// User id se JWT token banata hai (7 din valid)
function makeToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Frontend ko sirf safe fields bhejo (password kabhi nahi)
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

// POST /api/auth/signup
export async function signup(req, res) {
  const { name, email, password } = req.body || {};

  const allText = [name, email, password].every((v) => typeof v === "string");
  if (!allText || !name.trim() || !email.trim() || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ token: makeToken(user._id), user: publicUser(user) });
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) {
    return res.status(400).json({ message: "Email or password is incorrect" });
  }

  res.json({ token: makeToken(user._id), user: publicUser(user) });
}
