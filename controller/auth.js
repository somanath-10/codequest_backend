import users from '../models/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from '../config/nodemailer.js';
import {UAParser}from 'ua-parser-js';
import requestIp from 'request-ip';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

const parser = new UAParser(req.headers['user-agent']);
const ua = parser.getResult();
const browser = ua.browser.name || 'Unknown';
const os = ua.os.name || 'Unknown';
const deviceType = ua.device.type || 'desktop'; // mobile/tablet/desktop
const rawUserAgent = req.headers['user-agent']; // ✅ define it

const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const now = new Date();
        const currentHour = now.getHours();

        // Store login history (optional: create a subdocument or array in user schema)
        if (!existingUser.loginHistory) existingUser.loginHistory = [];
        existingUser.loginHistory.push({
            time: now,
            ip: clientIp,
            browser,
            os,
            deviceType
        });
        await existingUser.save();

        // Handle conditions:
        if (browser === 'Chrome') {
            // Send OTP to email
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins

            existingUser.otp = otp;
            existingUser.otpExpiresAt = otpExpiresAt;
            await existingUser.save();

            await transporter.sendMail({
                from: 'somanathr1006@gmail.com',
                to: email,
                subject: 'Login OTP Verification',
                text: `Your login OTP is ${otp}. It expires in 10 minutes.`,
            });

            return res.status(200).json({
                success:false,
                email:email,
                otpRequired: true,
                message: 'OTP sent to your email. Please verify.',
            });
        }

        if (browser === 'Edge' || rawUserAgent?.includes("PostmanRuntime")) {
            // Allow login directly
            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({ result: existingUser, token });
        }

        if (deviceType === 'mobile') {
            if (currentHour >= 10 && currentHour < 13) {
                const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).json({ result: existingUser, token });
            } else {
                return res.status(403).json({ message: 'Mobile login allowed only from 10 AM to 1 PM' });
            }
        }

        // Default case — restrict or customize
        return res.status(403).json({ message: 'Login not allowed from this device/browser' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message});
    }
};


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (extinguser) {
            return res.status(404).json({ message: "User already exist" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const newuser = await users.create({
            name,
            email,
            password: hashedpassword
        });
        const token = jwt.sign({
            email: newuser.email, id: newuser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )
        res.status(200).json({ result: newuser, token });
    } catch (error) {
        res.status(500).json("something went wrong...")
        return
    }
}