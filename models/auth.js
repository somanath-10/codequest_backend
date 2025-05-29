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
  }
});

export default mongoose.model("User", userSchema);

