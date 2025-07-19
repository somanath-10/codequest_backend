import Question from "../models/Question.js";
import mongoose from "mongoose";

import User from "../models/auth.js";

export const Askquestion = async (req, res) => {
  const postquestiondata = req.body;
  const userid = req.userid;

  try {
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const subscription = user.subscription || { plan: "Free", dailyLimit: 1 };

    const today = new Date().toDateString();
    const lastReset = user.subscription?.lastResetDate?.toDateString();

    // Reset daily count if it's a new day
    if (today !== lastReset) {
      user.subscription.questionsPostedToday = 0;
      user.subscription.lastResetDate = new Date();
    }

    // Check if limit exceeded
    if (
      user.subscription.questionsPostedToday >=
      (user.subscription.dailyLimit ?? 1)
    ) {
      return res
        .status(200)
        .json({dailylimit:false,success:false, message: "Daily question limit reached for your plan." });
    }

    // Post question
    const postquestion = new Question({ ...postquestiondata, userid });
    await postquestion.save();

    // Update count
    user.subscription.questionsPostedToday += 1;
    await user.save();

    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Couldn't post a new question");
  }
};


export const getallquestion = async (req, res) => {
    try {
        const questionlist = await Question.find().sort({ askedon: -1 });
        res.status(200).json(questionlist)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message });
        return
    }
};

export const deletequestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }
    try {
        await Question.findByIdAndDelete(_id);
        res.status(200).json({ message: "successfully deletd..." })
    } catch (error) {
        res.status(404).json({ message: error.message });
        return
    }
};

export const votequestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value } = req.body;
    const userid = req.userid;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }
    try {
        const question = await Question.findById(_id);
        const upindex = question.upvote.findIndex((id) => id === String(userid))
        const downindex = question.downvote.findIndex((id) => id === String(userid))
        if (value === "upvote") {
            if (downindex !== -1) {
                question.downvote = question.downvote.filter((id) => id !== String(userid))
            }
            if (upindex === -1) {
                question.upvote.push(userid);
            } else {
                question.upvote = question.upvote.filter((id) => id !== String(userid))
            }
        } else if (value === "downvote") {
            if (upindex !== -1) {
                question.upvote = question.upvote.filter((id) => id !== String(userid))
            }
            if (downindex  === -1) {
                question.downvote.push(userid);
            } else {
                question.downvote = question.downvote.filter((id) => id !== String(userid))
            }
        }
        await Question.findByIdAndUpdate(_id, question);
        res.status(200).json({ message: "voted successfully.." })

    } catch (error) {
        res.status(404).json({ message: "id not found" });
        return
    }
}
