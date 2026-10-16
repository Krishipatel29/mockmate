import jwt from "jsonwebtoken";

// Protected routes ke pehle chalta hai.
// Header mein "Authorization: Bearer <token>" aana chahiye.
export default function auth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // aage controllers isse use karte hain
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
}
