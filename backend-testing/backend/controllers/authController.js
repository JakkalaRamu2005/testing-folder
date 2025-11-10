
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../modals/db.js"


export const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // checking for the existing user
        const [existingUser] = await db.execute("SELECT * FROM users WHERE email =?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "user already exits" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute("INSERT INTO users (username, email, password) VALUES (?,?,?)", [username, email, hashedPassword]);

        res.status(201).json({ message: "user registered successfully" });

    }catch(error){
        console.error(error);
        res.status(500).json({message: "server error during registration"});
    }




    






}

export const LoginUser = async(req, res)=>{

    const {email, password} = req.body;

    const [userResult] = await db.execute("SELECT * FROM users WHERE email =?", [email]);

    if(userResult.length===0){
        return res.status(400).json({message: "Invalid email or password"});

    }

    const user = userResult[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({message: "Invalid email or password"});
    }


    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET,{
        expiresIn: "1d",
    });


    res.status(200).json({message: "Login successfull", token, user:{id: user.id, username: user.username, email: user.email},
    });

}