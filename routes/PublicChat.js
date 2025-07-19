// routes/publicChat.js
import express from "express";
import PublicMessage from "../models/publicChat.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  const messages = await PublicMessage.find()
    .populate("sender", "name")
    .sort({ createdAt: 1 });
  res.json({ messages });
});

// Post a new message
router.post("/", auth, async (req, res) => {
  const { text,userId } = req.body;
  console.log("text",text)
  if (!text) return res.status(400).json({ msg: "Message text is required" });
  const userid = userId;
  console.log(userid)
  const message = await PublicMessage.create({
    sender: userid,
    text,
  });

  res.status(201).json({ message });
});

export default router;
