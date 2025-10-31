import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MessageBubble = ({ message, onSpeak, speaking, onStopSpeak }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        {message.hasImage && (
          <div className="mb-2 text-sm opacity-75">
            📷 Image attached
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
        
        {!isUser && (
          <button
            onClick={() => speaking ? onStopSpeak() : onSpeak(message.content)}
            className="mt-2 text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {speaking ? 'Stop' : 'Listen'}
          </button>
        )}
        
        <p className="text-xs opacity-50 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
