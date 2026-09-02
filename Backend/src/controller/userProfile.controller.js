import UserModel from "../model/auth.model.js";
import FollowModel from "../model/follow.model.js";
import PostModel from "../model/post.model.js";

export async function getUserProfile(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const user = await UserModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let followRecord = await FollowModel.findById(userId);
        if (!followRecord) {
            followRecord = await FollowModel.create({
                _id: userId,
                followers: [],
                following: [],
                bio:user.bio
            });
        }

        let currentUserFollowRecord = await FollowModel.findById(currentUserId);
        if (!currentUserFollowRecord) {
            currentUserFollowRecord = await FollowModel.create({
                _id: currentUserId,
                followers: [],
                following: [],
            });
        }

        const posts = await PostModel.find({ user: userId }).sort({ createdAt: -1 });

        const isFollowing = followRecord.followers.some(
            (id) => id.toString() === currentUserId.toString()
        );

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                _id: user._id,
                id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio || "",
                followersCount: followRecord.followers.length,
                followingCount: followRecord.following.length,
                postsCount: posts.length,
                isFollowing,
            },
            posts,
            followStats: {
                followersCount: followRecord.followers.length,
                followingCount: followRecord.following.length,
            },
            currentUserFollowRecord,
        });
    } catch (error) {
        console.log("Get Profile Error:", error);

        return res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
}