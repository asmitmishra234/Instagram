import ReelModel from "../model/reel.model.js";
import StorageService from "../services/storage.services.js";


// CREATE REEL
export async function createReel(req, res) {
    try {

        const { caption } = req.body;
        const userId = req.user.id || req.user._id;

        // Video check
        if (!req.file) {
            return res.status(400).json({
                message: "Video is required",
            });
        }

        // Upload video to ImageKit
        const result = await StorageService.uploadFile(
            req.file.buffer,
            req.file.originalname
        );

        console.log("ImageKit Reel Result:", result);

        // Save reel in MongoDB
        const reel = await ReelModel.create({
            user: userId,
            videoUrl: result.url,
            caption: caption || "",
        });

        return res.status(201).json({
            message: "Reel created successfully",
            reel,
        });

    } catch (error) {

        console.log("Create Reel Error:", error);

        return res.status(500).json({
            message: "Failed to create reel",
            error: error.message,
        });
    }
}

// GetReels
export async function getReels(req, res) {
    try {

        const reels = await ReelModel.find()
            .populate("user", "userName profileImage")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Reels fetched successfully",
            reels,
        });

    } catch (error) {

        console.log("Get Reels Error:", error);

        return res.status(500).json({
            message: "Failed to fetch reels",
            error: error.message,
        });
    }
}

   // likeReels
export async function likeReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user.id || req.user._id;

        const reel = await ReelModel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found",
            });
        }

        const alreadyLiked = reel.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {

            // Unlike
            reel.likes = reel.likes.filter(
                (id) => id.toString() !== userId.toString()
            );

        } else {

            // Like
            reel.likes.push(userId);
        }

        await reel.save();

        return res.status(200).json({
            message: alreadyLiked
                ? "Reel unliked"
                : "Reel liked",

            liked: !alreadyLiked,

            likesCount: reel.likes.length,
        });

    } catch (error) {

        console.log("Like Reel Error:", error);

        return res.status(500).json({
            message: "Failed to like reel",
            error: error.message,
        });
    }
}

   //AddView 
export async function addView(req, res) {
    try {
        const { reelId } = req.params;

        const reel = await ReelModel.findByIdAndUpdate(
            reelId,
            {
                $inc: {
                    views: 1,
                },
            },
            {
                new: true,
            }
        );

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found",
            });
        }

        return res.status(200).json({
            message: "View added successfully",
            views: reel.views,
        });

    } catch (error) {

        console.log("Add View Error:", error);

        return res.status(500).json({
            message: "Failed to add view",
            error: error.message,
        });
    }
}

     //DeleteReel
export async function deleteReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user.id || req.user._id;

        const reel = await ReelModel.findById(reelId);

        if (!reel) {
            return res.status(404).json({
                message: "Reel not found",
            });
        }

        // Check ownership
        if (reel.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own reel",
            });
        }

        await ReelModel.findByIdAndDelete(reelId);

        return res.status(200).json({
            message: "Reel deleted successfully",
        });

    } catch (error) {

        console.log("Delete Reel Error:", error);

        return res.status(500).json({
            message: "Failed to delete reel",
            error: error.message,
        });
    }
}