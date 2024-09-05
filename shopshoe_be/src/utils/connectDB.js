import { connect } from "mongoose";
import { DB_URL } from "./env.js";
export const connectDB = async () => {
    try {
        await connect(DB_URL);
        console.log("Connect DB successfully");
    } catch (error) {
        console.log(`Connect DB failed: ${error}`);
    }
};
