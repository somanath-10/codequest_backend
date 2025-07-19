import passport from "passport";
import User from '../models/auth.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {UAParser}from 'ua-parser-js';

import dotenv from "dotenv"
dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "/api/auth/google/callback",
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope:["profile","email"],
          passReqToCallback: true, // ✅ Add this line

    },

    async (req,accessToken, refreshToken, profile, done) => {
      console.log("callback",process.env.GOOGLE_CALLBACK_URL)
      console.log("cliendid",process.env.GOOGLE_CLIENT_ID);
      console.log("clientsec",process.env.GOOGLE_CLIENT_SECRET);
      console.log("int password",profile)
      try {
        console.log("first")
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser){
         const parser = new UAParser(req.headers['user-agent']);
const ua = parser.getResult();
const browser = ua.browser.name || 'Unknown';
const os = ua.os.name || 'Unknown';
const deviceType = ua.device.type || 'desktop'; // mobile/tablet/desktop
        const now = new Date();
        const currentHour = now.getHours();
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        existingUser.loginHistory.push({
            time: now,
            ip: clientIp,
            browser,
            os,
            deviceType
        });
        await existingUser.save();
          return done(null, existingUser);
        }  
        existingUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: "GOOGLE_AUTH",
            about: "",
            tags: [],
            loginHistory: [],
            subscription: {
              plan: "Free",
              dailyLimit: 1,
              questionsPostedToday: 0,
              startDate: new Date(),
              lastResetDate: new Date(),
            },
          });
          console.log("existing User",existingUser);
          console.log("second")
        done(null, existingUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;