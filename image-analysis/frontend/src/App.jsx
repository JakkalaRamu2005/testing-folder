import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [recording, setRecording] = useState(false);
  const wsRef = useRef(null);
  const recorderRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:5000/");
    wsRef.current.onmessage = (event) => {
      // When Gemini sends audio back
      const msg = JSON.parse(event.data);
      if (msg.data?.audio?.data) {
        const audio = new Audio(`data:audio/wav;base64,${msg.data.audio.data}`);
        audio.play();
      }
    };
    return () => wsRef.current.close();
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    recorder.ondataavailable = async (e) => {
      const buffer = await e.data.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      wsRef.current.send(
        JSON.stringify({
          realtimeInput: {
            mediaChunks: [{ data: base64Audio, mimeType: "audio/webm" }],
          },
        })
      );
    };

    recorder.start(250);
    recorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎙️ Smart Dharani Voice Assistant</h1>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Talking" : "Start Talking"}
      </button>
    </div>
  );
}
