import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Route for chatbot
app.post("/api/dharani/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "Error communicating with Gemini API." });
  }
});

app.listen(9291, () => console.log("✅ Smart Dharani backend running on http://localhost:9291"));
