
import StoryModel from "../model/story.model.js";
import StorageService from "../services/storage.services.js";

export async function createStory(req, res) {
    try {
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

        const expiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        const story = await StoryModel.create({
            user: userId,
            imageUrl: result.url,
            expiresAt,
        });

        return res.status(201).json({
            message: "Story created successfully",
            story,
        });

    } catch (error) {
        console.log("Create Story Error:", error);

        return res.status(500).json({
            message: "Failed to create story",
            error: error.message,
        });
    }
}


export async function getStories(req, res) {
    try {
        const stories = await StoryModel.find({
            expiresAt: {
                $gt: new Date(),
            },
        })
            .populate("user", "userName profileImage")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Stories fetched successfully",
            stories,
        });

    } catch (error) {
        console.log("Get Stories Error:", error);

        return res.status(500).json({
            message: "Failed to fetch stories",
            error: error.message,
        });
    }
}


export async function viewStory(req, res) {
    try {
        const { storyId } = req.params;
        const userId = req.user.id || req.user._id;

        const story = await StoryModel.findById(storyId);

        if (!story) {
            return res.status(404).json({
                message: "Story not found",
            });
        }

        if (story.expiresAt < new Date()) {
            return res.status(410).json({
                message: "Story has expired",
            });
        }

        const alreadyViewed = story.viewers.some(
            (id) => id.toString() === userId.toString()
        );

        if (!alreadyViewed) {
            story.viewers.push(userId);
            await story.save();
        }

        return res.status(200).json({
            message: "Story viewed successfully",
        });

    } catch (error) {
        console.log("View Story Error:", error);

        return res.status(500).json({
            message: "Failed to view story",
            error: error.message,
        });
    }
}

