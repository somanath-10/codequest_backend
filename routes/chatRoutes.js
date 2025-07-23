import express from "express";
import Chat from "../models/chat.js";
import Message from "../models/Message.js";
import auth from "../middleware/Auth1.js";

const router = express.Router();

// Get all user chats
router.post("/chats", auth, async (req, res) => {
  try {
    const {userid} = req.body;
    const chats = await Chat.find({ members: userid }).populate("members", "name email");
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start chat or fetch existing one
router.post("/chat", async (req, res) => {
  const { userid,otherUserId } = req.body;
  try {
    let chat = await Chat.findOne({ members: { $all: [userid, otherUserId] } });
    if (!chat) {
      chat = await Chat.create({ members: [userid, otherUserId] });
    }
    chat = await chat.populate("members", "name email");
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a message
router.post("/message", async (req, res) => {
  const { userid,chatId, text } = req.body;
  try {
    await Message.create({ chatId, text, sender: userid });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages in a chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
