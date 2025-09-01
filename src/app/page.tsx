"use client";

import { useState, useRef, useEffect } from "react";
import { startSession, sendMessage } from "@/lib/api";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ role: string; text: string; difficulty?: number }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleStart() {
    try {
      const data = await startSession("General", "Learn effectively");
      setSessionId(data.session_id);
      setMessages([{ role: "system", text: `Session started on topic: ${data.topic}` }]);
    } catch {
      setMessages([{ role: "system", text: "Error: Could not start session." }]);
    }
  }

  async function handleSend() {
    if (!sessionId || !input.trim()) return;

    const messageToSend = input;
    setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    setInput("");

    try {
      const data = await sendMessage(sessionId, messageToSend);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.assistant, difficulty: data.difficulty },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error: Could not reach backend." },
      ]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {!sessionId ? (
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        >
          Start Session
        </button>
      ) : (
        <div className="w-full max-w-xl flex flex-col h-[80vh]">
          <div className="flex-1 border border-gray-300 rounded-lg p-4 bg-white shadow-md overflow-y-auto mb-4 flex flex-col gap-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[75%] ${
                  m.role === "user"
                    ? "bg-blue-100 text-blue-900 self-end"
                    : "bg-green-100 text-green-900 self-start"
                }`}
              >
                <div className="font-semibold text-sm mb-1">{m.role === "user" ? "You" : "Tutor"}</div>
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
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold shadow"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
