// const isIST10To11 = () => {
//   const now = new Date();
//   const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
//   const hour = ist.getHours();
//   return hour === 10;
// };
// router.post("/create-order", async (req, res) => {
//   if (!isIST10To11()) return res.status(403).json({ message: "Payments allowed only between 10–11 AM IST" });

//   const { amount } = req.body;

//   const options = {
//     amount: amount * 100, // Razorpay accepts paise
//     currency: "INR",
//     receipt: `receipt_order_${Math.random()}`,
//   };

//   const order = await razorpayInstance.orders.create(options);
//   res.json({ orderId: order.id });
// });

// router.post("/verify", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = req.body;
//   const generated_signature = crypto
//     .createHmac("sha256", RAZORPAY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generated_signature !== razorpay_signature) {
//     return res.status(400).json({ message: "Invalid signature" });
//   }

//   const limits = {
//     Bronze: { price: 100, dailyLimit: 5 },
//     Silver: { price: 300, dailyLimit: 10 },
//     Gold: { price: 1000, dailyLimit: Infinity }
//   };

//   await User.findByIdAndUpdate(userId, {
//     subscription: {
//       plan,
//       dailyLimit: limits[plan].dailyLimit,
//       subscriptionEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       questionsPostedToday: 0,
//       lastResetDate: new Date(),
//     },
//   });

//   // send invoice email
//   await transporter.sendMail({
//     from: "your@email.com",
//     to: user.email,
//     subject: "Subscription Activated",
//     html: `<h3>Thank you for subscribing!</h3>
//       <p>Plan: ${plan}</p>
//       <p>Price: ₹${limits[plan].price}</p>
//       <p>Valid till: ${subscriptionEnds.toLocaleDateString()}</p>`,
//   });

//   res.json({ success: true });
// });




import express from 'express';
import { createSubscriptionOrder, verifyPayment } from '../controller/paymentController.js';
import timeWindowGuard from '../middleware/timeWindowGuard.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', timeWindowGuard, createSubscriptionOrder);
router.post('/verify', verifyPayment);

export default router;
