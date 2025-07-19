// import Post from '../models/post.js';
// import User from '../models/auth.js';

// const getTodayPostCount = async (userId) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return await Post.countDocuments({
//     userId,
//     createdAt: { $gte: today }
//   });
// };

// export const createPost = async (req, res) => {
//   const { mediaUrl, caption } = req.body;
//   const userId = req.userid;

//   try {
//     const user = await User.findById(userId).populate("friends");
//     const friendsCount = user.friends.length;

//     const todayPosts = await getTodayPostCount(userId);

//     if (friendsCount === 0 && todayPosts >= 0)
//       return res.status(403).json({ message: "You must have at least 1 friend to post." });

//     if (friendsCount === 1 && todayPosts >= 1)
//       return res.status(403).json({ message: "You can only post once per day with 1 friend." });

//     if (friendsCount === 2 && todayPosts >= 2)
//       return res.status(403).json({ message: "You can only post twice per day with 2 friends." });

//     if (friendsCount <= 10 && todayPosts >= friendsCount)
//       return res.status(403).json({ message: `You can post ${friendsCount} time(s) per day.` });

    
//     const post = new Post({ userId, mediaUrl, caption });
//     await post.save();

//     res.status(201).json({ success: true, post });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Fetch all posts
// export const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .sort({ createdAt: -1 })
//       .populate('userId', 'name email')
//       .populate('comments.userId', 'name');
//     res.status(200).json({ success: true, posts });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Like or Unlike a post
// export const likePost = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userid;

//   try {
//     const post = await Post.findById(id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const index = post.likes.indexOf(userId);
//     if (index === -1) {
//       post.likes.push(userId); // like
//     } else {
//       post.likes.splice(index, 1); // unlike
//     }

//     await post.save();
//     res.status(200).json({ success: true, likes: post.likes.length });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Add a comment
// export const commentOnPost = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userid;
//   const { text } = req.body;

//   try {
//     const post = await Post.findById(id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     post.comments.push({ userId, text });
//     await post.save();

//     res.status(200).json({ success: true, comments: post.comments });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
import Post from "../models/post.js";
import User from "../models/auth.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

export const createPost = async (req, res) => {
  const { caption,userId } = req.body;
  const media1 = req.files.postpicture;
  var media = "";
  try{
  console.log("first")
     media = await uploadImageToCloudinary(media1,"babbar",1000,1000);
    console.log("seocnd")
    }
  catch(err){
    return res.status(403).json({
      success:false,
      message:err.message,
    })
  }

  // const userId = req.userid;

  try {
    const user = await User.findById(userId).populate("friends");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postCountToday = await Post.countDocuments({
      userId,
      createdAt: { $gte: today },
    });


    let maxPosts = 0;
    const friendCount = user.friends.length;
    if (friendCount === 0) maxPosts = 0;
    else if (friendCount === 1) maxPosts = 1;
    else if (friendCount === 2) maxPosts = 2;
    else if (friendCount > 10) maxPosts = Infinity;

    if (postCountToday >= maxPosts) {
      return res.status(403).json({ message: "Post limit reached for today" });
    }

    const post = new Post({ userId, caption, media:media.secure_url });
    await post.save();
    console.log("there")
    return res.status(200).json({success:true, message: "Post created", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const {userId }= req.body;
  const post = await Post.findById(postId);
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    await post.save();
    return res.status(200).json({ message: "Liked post" });
  } else {
    return res.status(400).json({ message: "Already liked" });
  }
};

export const commentPost = async (req, res) => {
  const { postId } = req.params;
  const { text,userId } = req.body;
  const post = await Post.findById(postId);
  post.comments.push({ userId, text });
  await post.save();
  res.status(200).json({ message: "Comment added" });
};

export const allposts = async(req,res)=>{
  try{
      const response = await Post.find({}).populate("likes","name").populate("comments.userId","name");
      return res.status(200).json({
        success:true,
        response,
        message:"fetched all posts"
      })
  }
  catch(err){
    return res.status(403).json({
      success:false,
      message:"Error in getting all posts"
    })
  }
}


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("userId", "name") // populate user
      .populate("comments.userId", "name"); // populate comment users

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const userpost = async(req,res)=>{
  try{
      const {userId} = req.params;
      const userresponse = await Post.find({userId:userId}).populate("likes","name").populate("comments.userId","name");
      
      return res.status(200).json({
        success:true,
        userresponse,
        message:"success ful"

      })
  }
  catch(err){
    return res.status(301).json({
      success:false,
      message:err.message,
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
