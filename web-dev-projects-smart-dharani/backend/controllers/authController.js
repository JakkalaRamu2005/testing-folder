import jwt from "jsonwebtoken"
import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const registerUser = (req, res) => {
    console.log("✅ Register API hit");
  const { email, password, confirmPassword } = req.body;

  // Step 1: Check all fields
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Step 2: Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Step 3: Hash the password (never store plain passwords)
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Step 4: Insert user into database
  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(sql, [email, hashedPassword], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error saving user" });
    }
    res.status(200).json({ message: "User registered successfully!" });
  });
};



export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true, 
      secure: false, 
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful", token });
  });
};
