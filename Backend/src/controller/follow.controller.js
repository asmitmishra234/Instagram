import UserModel from "../model/auth.model.js";
import FollowModel from "../model/follow.model.js";

export async function followUsers(req, res) {
    try {
        const currentUserId = req.user.id || req.user._id;
        const { userId } = req.params;
        const currentUserIdString = currentUserId.toString();
        const targetUserIdString = userId.toString();

        if (currentUserIdString === targetUserIdString) {
            return res.status(400).json({
                message: "You cannot follow yourself",
            });
        }

        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let userToFollow = await FollowModel.findById(userId);
        if (!userToFollow) {
            userToFollow = await FollowModel.create({
                _id: userId,
                followers: [],
                following: [],
            });
        }

        let currentUser = await FollowModel.findById(currentUserId);
        if (!currentUser) {
            currentUser = await FollowModel.create({
                _id: currentUserId,
                followers: [],
                following: [],
            });
        }

        const alreadyFollowing = currentUser.following.some((id) => id.toString() === targetUserIdString);
        if (alreadyFollowing) {
            return res.status(400).json({
                message: "Already following this user",
            });
        }

        currentUser.following.push(userId);
        userToFollow.followers.push(currentUserId);

        await currentUser.save();
        await userToFollow.save();

        return res.status(200).json({
            message: "User followed successfully",
        });
    } catch (error) {
        console.log("Follow Error:", error);

        return res.status(500).json({
            message: "Failed to follow user",
            error: error.message,
        });
    }
}

export async function unfollowUser(req, res) {
    try {
        const currentUserId = req.user.id || req.user._id;
        const { userId } = req.params;
        const currentUserIdString = currentUserId.toString();
        const targetUserIdString = userId.toString();

        let currentUser = await FollowModel.findById(currentUserId);
        if (!currentUser) {
            currentUser = await FollowModel.create({
                _id: currentUserId,
                followers: [],
                following: [],
            });
        }

        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let userToUnfollow = await FollowModel.findById(userId);
        if (!userToUnfollow) {
            userToUnfollow = await FollowModel.create({
                _id: userId,
                followers: [],
                following: [],
            });
        }

        currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserIdString);
        userToUnfollow.followers = userToUnfollow.followers.filter((id) => id.toString() !== currentUserIdString);

        await currentUser.save();
        await userToUnfollow.save();

        return res.status(200).json({
            message: "User unfollowed successfully",
        });
    } catch (error) {
        console.log("Unfollow Error:", error);

        return res.status(500).json({
            message: "Failed to unfollow user",
            error: error.message,
        });
    }
}