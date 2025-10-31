// ✅ Import modules
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

// ✅ App setup
const app = express();
const PORT = 5000;

app.get("/", (req, res) => res.send("🎙️ Gemini Live API backend running..."));
const server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ WebSocket server (Frontend <-> Backend)
const wss = new WebSocketServer({ server });

// ---------------------------------------------
// Gemini Live API connection logic (like your reference)
// ---------------------------------------------

const GEMINI_LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";

wss.on("connection", async (frontendSocket) => {
  console.log("🌐 Frontend connected");

  // ✅ Connect backend to Gemini Live API
  const geminiSocket = new WebSocket(
    `wss://generativelanguage.googleapis.com/v1beta/models/${GEMINI_LIVE_MODEL}:connect?key=${process.env.GEMINI_API_KEY}`
  );

  // Queue for messages
  const responseQueue = [];

  // -----------------------------
  // Helper: Wait for next message
  // -----------------------------
  async function waitMessage() {
    while (responseQueue.length === 0) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return responseQueue.shift();
  }

  // -----------------------------
  // Helper: Handle one "turn"
  // -----------------------------
  async function handleTurn() {
    const turns = [];
    let done = false;
    while (!done) {
      const message = await waitMessage();
      turns.push(message);
      if (message?.serverContent?.turnComplete) done = true;
    }
    return turns;
  }

  // -----------------------------
  // Gemini connection callbacks
  // -----------------------------
  geminiSocket.onopen = () => {
    console.log("🧠 Gemini Live API Connected");
    const config = {
      responseModalities: ["AUDIO"],
      systemInstruction: "You are a friendly Telugu-speaking crop advisor.",
    };

    // Send config to Gemini
    geminiSocket.send(JSON.stringify({ setup: { config } }));
  };

  geminiSocket.onmessage = async (event) => {
    const msg = JSON.parse(event.data.toString());
    responseQueue.push(msg);
    frontendSocket.send(JSON.stringify(msg)); // forward to React
  };

  geminiSocket.onerror = (e) => console.error("❌ Gemini error:", e.message);
  geminiSocket.onclose = () => console.log("🔌 Gemini closed");

  // -----------------------------
  // Frontend sends audio chunks
  // -----------------------------
  frontendSocket.on("message", async (rawData) => {
    try {
      const msg = JSON.parse(rawData.toString());
      if (msg?.realtimeInput?.mediaChunks) {
        // Forward audio chunks to Gemini
        geminiSocket.send(JSON.stringify(msg));
      }
    } catch (err) {
      console.error("⚠️ Invalid message from frontend", err);
    }
  });

  // -----------------------------
  // On Frontend close
  // -----------------------------
  frontendSocket.on("close", () => {
    console.log("❎ Frontend disconnected");
    geminiSocket.close();
  });
});
