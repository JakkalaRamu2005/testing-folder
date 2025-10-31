import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Click Start to begin conversation');
  const [transcript, setTranscript] = useState([]);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);

  // Initialize audio context
  const initAudioContext = async () => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000
    });

    // Get microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      } 
    });
    
    mediaStreamRef.current = stream;
    
    // Create audio source
    const source = audioContextRef.current.createMediaStreamSource(stream);
    
    // Create script processor for capturing audio
    const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert to 16-bit PCM
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Send audio to Gemini
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
        
        const message = {
          realtimeInput: {
            mediaChunks: [{
              mimeType: 'audio/pcm;rate=16000',
              data: base64Audio
            }]
          }
        };
        
        wsRef.current.send(JSON.stringify(message));
      }
    };
    
    source.connect(processor);
    processor.connect(audioContextRef.current.destination);
    audioWorkletNodeRef.current = processor;
  };

  // Play audio response
  const playAudio = async (base64Data) => {
    const audioData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }
    
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  };

  // Start conversation
  const startConversation = async () => {
    try {
      setStatus('Connecting...');
      
      // Initialize audio
      await initAudioContext();
      
      // Connect to WebSocket proxy
      wsRef.current = new WebSocket('ws://localhost:8080');
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setStatus('🟢 Connected! Start speaking...');
        addTranscript('System', 'Connection established. You can start talking now!');
      };
      
      wsRef.current.onmessage = async (event) => {
        const response = JSON.parse(event.data);
        
        // Handle audio response
        if (response.serverContent?.modelTurn?.parts) {
          for (const part of response.serverContent.modelTurn.parts) {
            if (part.inlineData?.mimeType?.includes('audio')) {
              setIsSpeaking(true);
              await playAudio(part.inlineData.data);
              setIsSpeaking(false);
            }
            
            if (part.text) {
              addTranscript('AI', part.text);
            }
          }
        }
        
        // Handle turn complete
        if (response.serverContent?.turnComplete) {
          setStatus('🟢 Listening... (Speak now)');
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('❌ Connection error');
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        setStatus('🔴 Disconnected');
        addTranscript('System', 'Conversation ended.');
      };
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      setStatus('❌ Failed to start: ' + error.message);
    }
  };

  // End conversation
  const endConversation = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsConnected(false);
    setStatus('Conversation ended. Click Start to begin again.');
  };

  // Add transcript message
  const addTranscript = (speaker, text) => {
    setTranscript(prev => [...prev, { speaker, text, time: new Date().toLocaleTimeString() }]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endConversation();
    };
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>🎙️ Conversational Voice Agent</h1>
        <p className="subtitle">Powered by Gemini Live API</p>

        <div className="status-bar">
          <div className={`status-indicator ${isConnected ? 'connected' : ''} ${isSpeaking ? 'speaking' : ''}`}>
            {isSpeaking ? '🔊 AI Speaking...' : isConnected ? '🎤 Listening...' : '⚪ Not Connected'}
          </div>
          <p className="status-text">{status}</p>
        </div>

        <div className="controls">
          {!isConnected ? (
            <button className="btn-start" onClick={startConversation}>
              🚀 Start Conversation
            </button>
          ) : (
            <button className="btn-end" onClick={endConversation}>
              ⏹️ End Conversation
            </button>
          )}
        </div>

        <div className="transcript-container">
          <h3>📝 Conversation Transcript</h3>
          <div className="transcript">
            {transcript.length === 0 ? (
              <p className="empty-state">No conversation yet. Start talking to see transcript here.</p>
            ) : (
              transcript.map((msg, idx) => (
                <div key={idx} className={`message ${msg.speaker.toLowerCase()}`}>
                  <span className="speaker">{msg.speaker}</span>
                  <span className="time">{msg.time}</span>
                  <p>{msg.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="instructions">
          <h4>💡 How to use:</h4>
          <ul>
            <li>Click "Start Conversation" and allow microphone access</li>
            <li>Start speaking naturally - AI will listen and respond</li>
            <li>Have a back-and-forth conversation</li>
            <li>Click "End Conversation" when done</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
