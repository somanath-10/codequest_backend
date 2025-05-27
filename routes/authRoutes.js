import express from "express"
const router = express.Router();
import {requestOtp,verifyOtp,resetPassword} from '../controller/authcontroller.js';

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);


export default router;
