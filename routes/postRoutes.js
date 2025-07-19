import express from "express";
import { createPost, likePost,userpost,getPostById, commentPost, allposts, deletePost } from "../controller/postcontroller.js";


const router = express.Router();

router.post("/create", createPost);
router.post("/like/:postId", likePost);
router.post("/comment/:postId", commentPost);
router.get("/allposts",allposts)
router.get('/:postId', getPostById);
router.get('/user/:userId',userpost);
router.delete('/user/delete/:postId',deletePost);
export default router;
