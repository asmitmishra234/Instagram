import express from "express";
import multer from "multer";
import { createPost,getFeed,likePost,addComment,getComments, deleteComment } from "../controller/post.controller.js";
import { followUsers,unfollowUser } from "../controller/follow.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
});
const postRouter = express.Router();
postRouter.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    createPost
);
postRouter.get("/feed",authMiddleware,getFeed)

postRouter.patch(
    "/:postId/like",
    authMiddleware,
    likePost
);

postRouter.post(
    "/:userId/follow",
    authMiddleware,
    followUsers
);

postRouter.delete(
    "/:userId/follow",
    authMiddleware,
    unfollowUser
);
// Add Comment
postRouter.post(
    "/:postId/comment",
    authMiddleware,
    addComment
);

// Get Comments
postRouter.get(
    "/:postId/comments",
    authMiddleware,
    getComments
);

// Delete Comment
postRouter.delete(
    "/:postId/comment/:commentId",
    authMiddleware,
    deleteComment
);

export default postRouter;