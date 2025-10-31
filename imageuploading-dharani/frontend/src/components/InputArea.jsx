import React, { useState, useRef } from 'react';
import { Send, Image, Mic, MicOff, X } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const InputArea = ({ onSendMessage, language, disabled }) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening 
  } = useSpeechRecognition(language);

  // Update message when transcript changes
  React.useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Image size should be less than 20MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!message.trim() && !selectedImage) || disabled) return;

    onSendMessage(message.trim(), selectedImage);
    setMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Container */}
      <div className="flex items-end gap-2">
        {/* Image Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Upload image"
        >
          <Image size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            rows="1"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Voice Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-600'
            } disabled:opacity-50`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} className="text-gray-600 dark:text-gray-400" />}
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !selectedImage)}
          className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
