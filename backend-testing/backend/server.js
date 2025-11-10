import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"
import db from "./modals/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.get("/", async(request, response)=>{
    response.json({message:"backend is running fine"});
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server is running at ${PORT}`);
})

