import User from "../models/auth"

const checkQuestionLimit = async (req, res, next) => {
    
  const user = await User.findById(req.userId);
  const today = new Date().toDateString();
  const lastReset = user.subscription.lastResetDate?.toDateString();

  if (today !== lastReset) {
    user.subscription.questionsPostedToday = 0;
    user.subscription.lastResetDate = new Date();
    await user.save();
  }

  if (user.subscription.questionsPostedToday >= user.subscription.dailyLimit) {
    return res.status(403).json({ message: "Daily question limit reached" });
  }

  user.subscription.questionsPostedToday += 1;
  await user.save();

  next();
};
