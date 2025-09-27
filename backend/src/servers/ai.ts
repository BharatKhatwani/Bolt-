// File: src/services/ai.service.ts
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { AIMessage } from "../types/index.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY!,
});
console.log(process.env.GOOGLE_GEMINI_KEY!);

/**
 * Call Google Gemini AI with messages and max tokens
 * @param messages - Array of AIMessage objects
 * @param maxTokens - Maximum tokens to generate
 * @returns AI response text
 */
export async function callGemini(messages: AIMessage[], maxTokens = 200): Promise<string> {
  // Convert AIMessage[] to a single string
  const content = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n\n");

  const responseStream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: content,
    
  });

  let result = "";
  for await (const chunk of responseStream) {
    result += chunk.text;
  }

  return result.trim();
}
