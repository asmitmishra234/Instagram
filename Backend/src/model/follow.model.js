import mongoose, { model, Schema } from "mongoose"
const followSchema=new mongoose.Schema({
        followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
})
const followUser=mongoose.model('follow',followSchema)
export default followUser