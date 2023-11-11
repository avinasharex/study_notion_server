import mongoose from "mongoose";

const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`\n mongoDB connected DB HOST: ${connectionInstance.connection.host}`);
    } catch (e) {
        console.log("MONGODB connection failed ", e);
        process.exit(1)
    }
}

export default connectDB