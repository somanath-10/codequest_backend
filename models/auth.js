import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  browser: String,
  os: String,
  deviceType: String,
  ip: String,
  time: Date,
});



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // optional: removes whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,         
    lowercase: true,      
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar:{type:String},
  googleId: { type: String, unique: true, sparse: true },
  about: {
    type: String,
    default: ""
  },
  tags: {
    type: [String],
    default: []
  },
  joinedOn: {
    type: Date,
    default: Date.now
  },
  loginHistory: [loginSchema],
  // 🔐 Password Reset OTP Fields
  lastPasswordReset: {
    type: Date
  },
  otp: {
    type: String
  },
  otpExpiresAt: {
    type: Date
  },
  token:{
    type:String,
  },

friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // models/User.js

  subscription: {
  plan: { type: String, default: 'Free' },
  dailyLimit: { type: Number, default: 1 },
  questionsPostedToday: { type: Number, default: 0 },
  lastResetDate: { type: Date },
  startDate: { type: Date },
}

});

export default mongoose.model("User", userSchema);

