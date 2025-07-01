import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database Connected Successfully")
    }).catch((err) => {
        console.log(`Database error: ${err.message}`)
    })
}

export default connectDB;