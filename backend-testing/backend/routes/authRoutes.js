import {LoginUser, registerUser } from "../controllers/authController.js"
import express from "express"


const router = express.Router();



router.post("/register", registerUser);
router.post("/login", LoginUser);

export default router;



