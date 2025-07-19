// models/PublicMessage.js
import mongoose from "mongoose";

const publicMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PublicMessage", publicMessageSchema);
