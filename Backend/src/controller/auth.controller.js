import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../model/auth.model.js";
import StorageService from "../services/storage.services.js";

export async function register(req, res) {
    try {
        const { userName, email, password, profileImage, bio } = req.body;

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { userName }],
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            userName,
            email,
            password: hash,
            profileImage,
            bio: bio?.trim?.() || "",
        });

        const tokenPayload = {
            id: user._id,
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio || "",
        };

        const token = jwt.sign(tokenPayload, process.env.SECRET_URI, {
            expiresIn: "7d",
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(201).json({
            message: "Registration Successful",
            user: {
                id: user._id,
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio || "",
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(404).json({
                message: "Password is incorrect",
            });
        }

        const tokenPayload = {
            id: user._id,
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio || "",
        };

        const token = jwt.sign(tokenPayload, process.env.SECRET_URI, {
            expiresIn: "7d",
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Login Successfull",
            user: {
                id: user._id,
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio || "",
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    res.clearCookie("accessToken");
    return res.status(200).json({
        message: "Logout successful",
    });
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio || "",
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { userName, profileImage, bio } = req.body;
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (userName && userName.trim()) {
            user.userName = userName.trim();
        }

        if (bio !== undefined) {
            user.bio = bio.trim();
        }

        if (req.file) {
            const result = await StorageService.uploadFile(req.file.buffer, req.file.originalname);
            user.profileImage = result.url;
        } else if (profileImage && profileImage.trim()) {
            user.profileImage = profileImage.trim();
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio || "",
            },
        });
    } catch (error) {
        console.log("Update Profile Error:", error);
        return res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        });
    }
};