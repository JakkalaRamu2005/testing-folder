import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const app = express();
app.use(express.json())



const PORT =process.env.PORT;
app.get("/",(req, res)=>{
    console.log(`server is running`);
    res.json("api is working fine");
})


app.listen(PORT,()=>{
    console.log(`server is running at the ${PORT}`);
})

