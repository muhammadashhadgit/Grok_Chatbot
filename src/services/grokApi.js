import axios from 'axios';

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export const sendMessageToGrok = async (message) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0]?.message?.content || "Sorry, I didn't get that.";
  } catch (error) {
    console.error('Grok API Error:', error);
    return 'Oops! Something went wrong.';
  }
};
