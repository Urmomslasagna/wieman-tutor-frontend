import axios from "axios";

// Define the expected response types
interface SessionResponse {
  session_id: number;
  topic: string;
}

interface TurnResponse {
  assistant: string;
  difficulty: number;
}

// Make sure to set this in your .env file or Render environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

// Start a new tutoring session
export async function startSession(topic: string, goals: string): Promise<SessionResponse> {
  const response = await axios.post<SessionResponse>(
    `${BACKEND_URL}/sessions`,
    { topic, goals }
  );
  return response.data;
}

// Send a user message to the backend and get assistant reply
export async function sendMessage(sessionId: number, message: string): Promise<TurnResponse> {
  const response = await axios.post<TurnResponse>(
    `${BACKEND_URL}/sessions/${sessionId}/turns`,
    { message }
  );
  return response.data;
}
