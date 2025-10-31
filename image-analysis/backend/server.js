import 'dotenv/config';
import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';

const PORT = 8080;
const GEMINI_WS_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY in .env');
  process.exit(1);
}



const wss = new WebSocketServer({ port: PORT });
console.log(`🚀 WebSocket proxy server running on ws://localhost:${PORT}`);


wss.on('connection', (clientWs) => {
  console.log('👤 Client connected');

  // Connect to Gemini Live API
  const geminiWs = new WebSocket(`${GEMINI_WS_URL}?key=${API_KEY}`);

  geminiWs.on('open', () => {
    console.log('✅ Connected to Gemini Live API');
    
    // Send initial configuration
    const config = {
      model: 'models/gemini-2.5-flash-native-audio-preview-09-2025',
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Kore'
            }
          }
        }
      },
      systemInstruction: {
        parts: [{ text: 'You are a helpful voice assistant. Have natural conversations with users. Be friendly and conversational.' }]
      }
    };

    geminiWs.send(JSON.stringify({ setup: config }));
  });

  // Forward messages from client to Gemini
  clientWs.on('message', (message) => {
    if (geminiWs.readyState === WebSocket.OPEN) {
      geminiWs.send(message);
    }
  });

  // Forward messages from Gemini to client
  geminiWs.on('message', (message) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(message);
    }
  });

  // Handle errors
  geminiWs.on('error', (error) => {
    console.error('❌ Gemini WS error:', error.message);
    clientWs.close();
  });

  clientWs.on('error', (error) => {
    console.error('❌ Client WS error:', error.message);
    geminiWs.close();
  });

  // Handle closures
  geminiWs.on('close', () => {
    console.log('🔴 Gemini connection closed');
    clientWs.close();
  });

  clientWs.on('close', () => {
    console.log('🔴 Client disconnected');
    geminiWs.close();
  });
});
