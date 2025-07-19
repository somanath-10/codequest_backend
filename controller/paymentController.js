import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/auth.js';
import sendInvoiceEmail from '../utils/sendInvoiceEmail.js';

import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const PLANS = {
  free: { name: "Free", price: 0, dailyLimit: 1 },
  bronze: { name: "Bronze", price: 10000, dailyLimit: 5 }, // ₹100.00
  silver: { name: "Silver", price: 30000, dailyLimit: 10 }, // ₹300.00
  gold: { name: "Gold", price: 100000, dailyLimit: Infinity }, // ₹1000.00
};

export const createSubscriptionOrder = async (req, res) => {
  const { id,plan } = req.body;

  if (!PLANS[plan]) {
    return res.status(400).json({ message: "Invalid plan selected" });
  }

  console.log("id",id);
  console.log("plan",plan);
console.log(process.env.RAZORPAY_KEY_ID)
console.log(process.env.RAZORPAY_KEY_SECRET);
//   const user = await User.findById(req.userid);
  const user = await User.findById(id);
  const amount = PLANS[plan].price;

  if (amount === 0) {
    user.subscription = {
      plan,
      startDate: new Date(),
      questionsPostedToday: 0,
      dailyLimit: PLANS[plan].dailyLimit,
      lastResetDate: new Date(),
    };
    await user.save();
    return res.status(200).json({ message: "Subscribed to Free plan" });
  }


  const options = {
    amount: amount,
    currency: 'INR',
    receipt: `receipt_order_`+Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ message: "Error creating order", error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  console.log("int verification");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan,id } = req.body;
  console.log(razorpay_order_id)
  console.log(razorpay_payment_id)
  console.log(razorpay_signature)
  console.log(plan)
  console.log(id);
  const user = await User.findById(id);
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid payment signature" });
  }

  console.log("plan",plan)
  console.log("daily limit",PLANS[plan].dailyLimit)
  console.log("qu")
  console.log("Lasr date",new Date())
  console.log("start date",new Date());

  user.subscription = {
    plan,
    dailyLimit: PLANS[plan].dailyLimit,
    questionsPostedToday: 0,
    lastResetDate: new Date(),
    startDate: new Date(),
  };

  await user.save();



  await sendInvoiceEmail(user.email, {
    name: user.name,
    plan: PLANS[plan].name,
    amount: PLANS[plan].price / 100,
    date: new Date().toLocaleString('en-IN'),
  });

  return res.status(200).json({ success: true, message: "Payment verified and subscription activated" });
};
