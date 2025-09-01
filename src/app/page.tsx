"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; text: string; difficulty?: number }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startSession() {
    const res = await fetch("http://127.0.0.1:8000/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "General", goals: "Learn effectively" }),
    });
    const data = await res.json();
    setSessionId(data.session_id);
    setMessages([{ role: "system", text: `Session started on topic: ${data.topic}` }]);
  }

  async function sendMessage() {
    if (!sessionId || !input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const messageToSend = input;
    setInput("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/sessions/${sessionId}/turns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.assistant, difficulty: data.difficulty },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Error: Could not reach backend." }]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {!sessionId && (
        <button
          onClick={startSession}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Start Session
        </button>
      )}

      {sessionId && (
        <div className="w-full max-w-lg flex flex-col">
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4 h-[60vh] overflow-y-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`mb-3 p-2 rounded ${
                  m.role === "user" ? "bg-blue-100 text-blue-900 self-end" : "bg-green-100 text-green-900"
                }`}
              >
                <div className="font-semibold text-sm">{m.role === "user" ? "You" : "Tutor"}</div>
                <div>{m.text}</div>
                {m.difficulty !== undefined && m.role === "assistant" && (
                  <div className="text-xs text-gray-500 mt-1">Difficulty: {m.difficulty}</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
