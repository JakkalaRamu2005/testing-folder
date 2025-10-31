import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import VoiceMode from './components/VoiceMode';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');

  const { speak, stop, speaking } = useSpeechSynthesis(language);

  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada',
    'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi'
  ];

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Load all sessions
  const loadSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/sessions`);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Create new chat
  const handleNewChat = async () => {
    try {
      const response = await axios.post(`${API_URL}/chat/new`);
      const newSessionId = response.data.sessionId;
      setCurrentSessionId(newSessionId);
      setMessages([]);
      await loadSessions();
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  // Select session
  const handleSelectSession = async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/chat/${sessionId}`);
      setCurrentSessionId(sessionId);
      setMessages(response.data.session.messages);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId) => {
    try {
      await axios.delete(`${API_URL}/chat/${sessionId}`);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      await loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Send message
  const handleSendMessage = async (text, image) => {
    if (!currentSessionId) {
      await handleNewChat();
    }

    const userMessage = {
      role: 'user',
      content: text || 'Image uploaded',
      hasImage: !!image,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', text || 'Analyze this image');
      formData.append('language', language);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(
        `${API_URL}/chat/${currentSessionId}/message`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      await loadSessions();

      // Auto-speak response if enabled
      // speak(response.data.response);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentSessionId ? 'Smart Dharani Chat' : 'Start a New Conversation'}
          </h2>
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Messages */}
        <ChatArea
          messages={messages}
          onSpeak={speak}
          speaking={speaking}
          onStopSpeak={stop}
        />

        {/* Input Area */}
        <InputArea
          onSendMessage={handleSendMessage}
          language={language}
          disabled={loading}
        />
      </div>

      {/* Voice Mode Button */}
      <VoiceMode
        language={language}
        onVoiceMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
