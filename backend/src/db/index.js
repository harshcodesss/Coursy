import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB= async ()=>{
    try {
        const connectionInstanct=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n✅ Mongo Db connected!`);
    } catch (error) {
        console.log(`MONGO Db connection failed`,error);
        process.exit(1);
    }
}

export {connectDB}