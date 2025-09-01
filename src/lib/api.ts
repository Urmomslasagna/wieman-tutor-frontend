import axios from "axios";

export async function sendMessage(sessionId: number, message: string) {
  const response = await axios.post(
    `http://127.0.0.1:8000/sessions/${sessionId}/turns`,
    { message }
  );
  return response.data;
}
