import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected");
        //disconnection
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected");
        });

        mongoose.connection.on("reconnect", () => {
            console.log("MongoDB reConnected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB Error:", err);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
