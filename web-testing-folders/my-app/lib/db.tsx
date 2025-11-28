import mongoose from "mongoose";


export async function connectDB() {

    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGO_URI!);
    } catch (err) {

        console.log("Mongo connection error", err);

    }

}