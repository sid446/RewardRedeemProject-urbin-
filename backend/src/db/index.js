import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB=async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`mongodb+srv://sidhantsingh:sidbrogo123@sidhant.putrf.mongodb.net/${DB_NAME}`);
        console.log(`\nMongoDB cennected !! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection Failed",error);
        process.exit(1);
        
    }
}

export default connectDB;
