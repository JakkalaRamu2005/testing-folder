import  mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config();


const db = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

});

/* db.connect((err)=>{
    if(err){
        console.error("Database connection error", err.message);
    }else{
        console.log("Database connected successfully")
    }
}) */

console.log("My sql connected");

export default db;