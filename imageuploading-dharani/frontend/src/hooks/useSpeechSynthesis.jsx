import { useState, useEffect } from 'react';

export const useSpeechSynthesis = (language = 'English') => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language to voice
    const languageMap = {
      'English': 'en-US',
      'Hindi': 'hi-IN',
      'Telugu': 'te-IN',
      'Tamil': 'ta-IN',
      'Kannada': 'kn-IN',
      'Malayalam': 'ml-IN',
      'Marathi': 'mr-IN',
      'Bengali': 'bn-IN',
      'Gujarati': 'gu-IN',
      'Punjabi': 'pa-IN'
    };

    utterance.lang = languageMap[language] || 'en-US';
    
    // Find appropriate voice
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return {
    speak,
    stop,
    speaking,
    supported: 'speechSynthesis' in window
  };
};
