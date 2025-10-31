import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store chat sessions (in production, use a database)
const chatSessions = new Map();

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Smart Dharani API is running! 🌾' });
});

// Create new chat session
app.post('/api/chat/new', (req, res) => {
  const sessionId = uuidv4();
  chatSessions.set(sessionId, {
    id: sessionId,
    title: 'New Chat',
    messages: [],
    createdAt: new Date().toISOString()
  });
  
  res.json({ 
    success: true, 
    sessionId,
    message: 'New chat session created'
  });
});

// Get all chat sessions
app.get('/api/chat/sessions', (req, res) => {
  const sessions = Array.from(chatSessions.values()).map(session => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    messageCount: session.messages.length
  }));
  
  res.json({ success: true, sessions });
});

// Get specific chat session
app.get('/api/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = chatSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({ success: true, session });
});

// Main chat endpoint (text and image)
app.post('/api/chat/:sessionId/message', upload.single('image'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, language = 'English' } = req.body;
    
    // Get or create session
    let session = chatSessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        title: message.substring(0, 50),
        messages: [],
        createdAt: new Date().toISOString()
      };
      chatSessions.set(sessionId, session);
    }

    // Add user message to session
    const userMessage = {
      role: 'user',
      content: message,
      hasImage: !!req.file,
      timestamp: new Date().toISOString()
    };
    session.messages.push(userMessage);

    // Prepare Gemini prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    let systemPrompt = `You are Smart Dharani, an expert AI assistant specializing in agriculture, crop diseases, and farming advice. You provide helpful, accurate, and compassionate guidance to farmers.

Rules:
- Always respond in ${language} language
- Be friendly, professional, and empathetic
- If analyzing crop images, provide detailed diagnosis
- Give practical, actionable advice
- Keep responses clear and easy to understand

Current conversation language: ${language}`;

    // Build conversation history
    let conversationHistory = systemPrompt + '\n\n';
    session.messages.slice(-5).forEach(msg => {
      conversationHistory += `${msg.role}: ${msg.content}\n`;
    });

    let result;
    
    // Handle image + text
    if (req.file) {
      const imageBase64 = req.file.buffer.toString('base64');
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      };
      
      result = await model.generateContent([conversationHistory + '\nUser: ' + message, imagePart]);
    } else {
      // Handle text only
      result = await model.generateContent(conversationHistory + '\nUser: ' + message);
    }

    const response = await result.response;
    const aiResponse = response.text();

    // Add AI response to session
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };
    session.messages.push(aiMessage);

    res.json({
      success: true,
      response: aiResponse,
      sessionId: session.id,
      language
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message',
      details: error.message 
    });
  }
});

// Delete chat session
app.delete('/api/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (chatSessions.delete(sessionId)) {
    res.json({ success: true, message: 'Session deleted' });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Dharani API running on http://localhost:${PORT}`);
});
