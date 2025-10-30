import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const [existing] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .promise()
      .query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        hashedPassword,
      ]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
