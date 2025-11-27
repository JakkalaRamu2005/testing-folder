import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatwidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "./systemPrompt.txt" },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  // Scrolls chat to bottom whenever messages change
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { role: "user", content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setText("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:9291/api/dharani/chat", {
        messages: newMsgs,
      });
      const aiReply = res.data.reply || "Sorry, I didn’t get that. Try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I couldn’t reach the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-widget ${open ? "open" : ""}`}>
      {/* Floating Toggle Button */}
      <div className="chat-toggle" onClick={() => setOpen((v) => !v)}>
        💬 Smart Dharani
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chat-panel">
          <div className="chat-header">Smart Dharani</div>

          <div className="messages" ref={boxRef}>
            {messages
              .filter((m) => m.role !== "system")
              .map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  {m.content}
                </div>
              ))}
            {loading && <div className="msg assistant">Typing...</div>}
          </div>

          <div className="composer">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about survey numbers, land details..."
            />
            <button onClick={send} disabled={loading || !text.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
