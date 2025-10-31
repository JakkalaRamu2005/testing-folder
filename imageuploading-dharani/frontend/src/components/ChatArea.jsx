import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const ChatArea = ({ messages, onSpeak, speaking, onStopSpeak }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Welcome to Smart Dharani 🌾
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your AI-powered farming assistant. Ask me anything about crops, diseases, or farming practices!
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                💬 Send text messages
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                📷 Upload crop images for diagnosis
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                🎤 Use voice input
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                🗣️ Enable voice responses
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              onSpeak={onSpeak}
              speaking={speaking}
              onStopSpeak={onStopSpeak}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatArea;
