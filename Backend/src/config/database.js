import mongoose from "mongoose"
const connectToDb=async()=>{
    await mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("server Connected to db")
})
}
export default connectToDb