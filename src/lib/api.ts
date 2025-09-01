import axios from "axios";

// Replace with your Render backend URL
const BACKEND_URL = "https://wieman-tutor-backend.onrender.com";

export async function startSession(topic: string, goals: string) {
  try {
    const response = await axios.post(`${BACKEND_URL}/sessions`, {
      topic,
      goals,
    });
    return response.data;
  } catch (err: any) {
    console.error("Error starting session:", err.response?.data || err.message);
    throw new Error("Failed to start session");
  }
}

export async function sendMessage(sessionId: number, message: string) {
  try {
    const response = await axios.post(`${BACKEND_URL}/sessions/${sessionId}/turns`, {
      message,
    });
    return response.data;
  } catch (err: any) {
    console.error("Error sending message:", err.response?.data || err.message);
    throw new Error("Failed to send message");
  }
}
