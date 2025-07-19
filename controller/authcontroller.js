import User from'../models/auth.js';
import transporter from '../config/nodemailer.js';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
export const requestOtp = async (req, res) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = new Date();
        if (user.lastPasswordReset && now - user.lastPasswordReset < 24 * 60 * 60 * 1000) {
            return res.status(429).json({ message: 'You can only reset your password once per day.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000); // valid 10 mins

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        await transporter.sendMail({
            from: 'somanathr2004@gmail.com',
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        });


  res.json({success:true, message: 'OTP sent to your email.' });
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }

};

export  const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.otp || !user.otpExpiresAt) {
    return res.status(400).json({ message: 'No OTP request found.' });
  }

  if (user.otp !== otp || new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
          const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "50h" });
          user.token = token;
          const options={
              expires:new Date(Date.now()+3*24*60*60*1000),
              httpOnly:true,
          }
          return res.cookie("token",token,options).status(200).json({
              success:true,
              token,
              existingUser:user,
              message:"cookie created successfully"
          })

  // res.json({success:true, message: 'OTP verified. You can now reset your password.' });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.lastPasswordReset = new Date();
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ success:true,message: 'Password successfully updated.' });
};
