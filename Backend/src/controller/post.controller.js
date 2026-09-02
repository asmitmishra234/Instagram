import PostModel from "../model/post.model.js";
import StorageService from "../services/storage.services.js";

export async function createPost(req, res) {
    try {
        const { caption } = req.body;
        const userId = req.user.id || req.user._id;

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }

        const result = await StorageService.uploadFile(
            req.file.buffer,
            req.file.originalname
        );

        const post = await PostModel.create({
            user: userId,
            imageUrl: result.url,
            caption: caption || "",
        });

        return res.status(200).json({
            message: "Post created successfulyy",
            post,
        });
    } catch (error) {
        console.log("Create Post Error:", error);

        return res.status(500).json({
            message: "Failed to create post",
            error: error.message,
        });
    }
}

export async function getFeed(req, res) {
    try {
        const posts = await PostModel.find()
            .populate("user", "userName profileImage")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Post fetched Successfully",
            posts,
        });
    } catch (error) {
        console.log("Get Feed Error:", error);

        return res.status(500).json({
            message: "Failed to fetch feed",
            error: error.message,
        });
    }
}

export async function likePost(req, res) {
    try {
        const { postId } = req.params;
        const userId = req.user.id || req.user._id;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());

        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            message: alreadyLiked ? "Post unliked" : "Post liked",
            likesCount: post.likes.length,
            liked: !alreadyLiked,
        });
    } catch (error) {
        console.log("Like Post Error:", error);

        return res.status(500).json({
            message: "Failed to like post",
            error: error.message,
        });
    }
}

export async function addComment(req, res) {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id || req.user._id;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty",
            });
        }

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        post.comments.push({
            user: userId,
            text: text.trim(),
        });

        await post.save();

        return res.status(201).json({
            message: "Comment added successfully",
            comment: post.comments[post.comments.length - 1],
        });
    } catch (error) {
        console.log("Add Comment Error:", error);

        return res.status(500).json({
            message: "Failed to add comment",
            error: error.message,
        });
    }
}

export async function getComments(req, res) {
    try {
        const { postId } = req.params;

        const post = await PostModel.findById(postId).populate(
            "comments.user",
            "userName profileImage"
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments: post.comments,
        });
    } catch (error) {
        console.log("Get Comments Error:", error);

        return res.status(500).json({
            message: "Failed to fetch comments",
            error: error.message,
        });
    }
}

export async function deleteComment(req, res) {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id || req.user._id;

        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own comment",
            });
        }

        comment.deleteOne();
        await post.save();

        return res.status(200).json({
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.log("Delete Comment Error:", error);

        return res.status(500).json({
            message: "Failed to delete comment",
            error: error.message,
        });
    }
}