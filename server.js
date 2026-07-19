import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userAuthRoutes from "./routes/userAuth.routes.js";

dotenv.config();

const app = express();
 
const port = process.env.PORT || 5003;
console.log(process.env);

connectDB();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Authentication API");
});

app.use("/api/auth", userAuthRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})