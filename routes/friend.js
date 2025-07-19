import express from "express";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getfriendrequests } from "../controller/friendController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/send-request", sendFriendRequest);
router.post("/accept-request", acceptFriendRequest);
router.post("/reject-request", rejectFriendRequest);
router.post("/requests",getfriendrequests);

export default router;
