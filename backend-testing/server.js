import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import "./config/db.js"; // to connect to the DB

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
