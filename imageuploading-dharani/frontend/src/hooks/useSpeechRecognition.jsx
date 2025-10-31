import { useState, useEffect, useRef } from 'react';

export const useSpeechRecognition = (language = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    // Map language codes
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

    recognitionRef.current.lang = languageMap[language] || 'en-US';

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported: 'webkitSpeechRecognition' in window
  };
};
