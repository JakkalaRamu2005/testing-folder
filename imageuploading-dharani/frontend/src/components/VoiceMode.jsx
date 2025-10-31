import React, { useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';

const VoiceMode = ({ language, onVoiceMessage }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
    // In a real implementation, this would connect to a real-time voice API
    if (!isActive) {
      alert('Voice-to-voice mode would connect to real-time conversation API. This requires Gemini Live API or similar service.');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <button
        onClick={handleToggle}
        className={`p-4 rounded-full shadow-lg transition-all ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-green-500 hover:bg-green-600'
        } text-white`}
        title={isActive ? 'End voice call' : 'Start voice call'}
      >
        {isActive ? <PhoneOff size={24} /> : <Phone size={24} />}
      </button>
      
      {isActive && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            🎤 Voice Mode Active
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Speak naturally to have a real-time conversation with Smart Dharani
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceMode;
