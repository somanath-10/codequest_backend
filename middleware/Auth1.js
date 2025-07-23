import jwt from "jsonwebtoken";
import User from "../models/auth.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing auth header" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "somu"); // Replace with .env value
    const user = await User.findById(decoded.id).populate("friends");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default auth;
