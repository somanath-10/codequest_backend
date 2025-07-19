import express from "express"
import  {login,signup} from '../controller/auth.js'
import { getallusers,updateprofile } from "../controller/users.js";
import auth from "../middleware/auth.js"
import { getLoginHistory } from "../controller/history.js";
import User from '../models/auth.js'

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);

router.get("/getallusers",getallusers)

router.patch("/update/:id",auth,updateprofile)
router.post("/loginhistory",getLoginHistory)
// routes/users.js
router.get("/", auth, async (req, res) => {
  const users = await User.find({}, "name _id");
  res.json({ users });
});

export default router