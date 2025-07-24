import express from "express"
import passport from "passport";
import jwt from "jsonwebtoken";
import { subscribe } from "diagnostics_channel";
import dotenv from "dotenv"
dotenv.config();

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: '/',    failureMessage: true  // tells Passport to put Google’s error on req.session.messages
//  }),
//   (req, res) => {
//     console.log("in google authenication",req.user);
//     const token = jwt.sign({         
//         _id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         avatar: req.user.avatar,
//         plan: req.user.subscription?.plan,
//         dailyLimit: req.user.subscription?.dailyLimit,
//         googleId : req.user.googleId,
//         subscription:req?.user?.subscription,
//         loginHistory:req.user.loginHistory,
//         friends:req.user.friends,
//         tags:req.user.tags,

//       }, process.env.JWT_SECRET, { expiresIn: '7d' });
//       console.log("token",token)
//       console.log("in last words")
//       console.log("web url",process.env.WEB_URL);
// res.cookie("token", token, {
//   httpOnly: false, // if you want to access via JS
//   secure: false,    // required if running over HTTPS
//   sameSite: "None" // required for cross-site cookies
// });

// // ✅ Clean redirect

//         const redirectUrl = process.env.WEB_URL + `/auth/callback`;
//     console.log("👉 Redirecting to:", redirectUrl);

// res.redirect(`${process.env.WEB_URL}/auth/callback?token=${token}`);

    
//   }
// );

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: '/' }),
  (req, res) => {
    console.log("✅ Reached /google/callback", req.user);

        const token = jwt.sign({         
        _id: req.user._id,
        email: req.user.email,
        

      }, process.env.JWT_SECRET, { expiresIn: '7d' });

    


    res.send(`
      <html><body>
        <script>
          window.location.href = "${process.env.WEB_URL}/auth/callback?token=${token}";
        </script>
      </body></html>
    `);
  }
);


router.get("/success", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Google Authentication Successful",
    user: req.user,
  });
});

router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google Authentication Failed",
  });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) return res.status(401).json({ message: "No token" });
      console.log("token",token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded)
    const User = require("../models/User");
    const user = await User.findById(decoded.id).select("-password");

    res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/login", (req, res) => {
  console.log("Login failed:", req.session.messages); // Should include actual Google error
  res.send("Login failed");
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    req.session.destroy((error) => {
      if (error) return res.status(500).json({ success: false, error: error.message });
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  });
});


export default router;