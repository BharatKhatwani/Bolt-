import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY!,
});

async function main() {
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: 'Hello',
  });

  console.log(response.text);
}

main().catch(console.error);
