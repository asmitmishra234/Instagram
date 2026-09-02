import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        videoUrl: {
            type: String,
            required: true,
        },

        caption: {
            type: String,
            default: "",
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const ReelModel = mongoose.model("reels", reelSchema);

export default ReelModel;