import { Router } from "express";
import { callGemini } from "../servers/ai.js";
import { BASE_PROMPT } from "../prompt.js";
import { basePrompt as nodeBasePrompt } from "../defaults/node.js";
import { basePrompt as reactBasePrompt } from "../defaults/react.js";
import { AIMessage, ErrorResponse, TemplateResponse } from "../types/index.js";

const router = Router();

// Detect if project is node or react
router.post("/", async (req, res) => {
  const prompt = req.body.prompt;

  // Input validation
  if (!prompt || typeof prompt !== "string") {
    const errorResponse: ErrorResponse = { error: "Prompt is required and must be a string" };
    return res.status(400).json(errorResponse);
  }

  const messages: AIMessage[] = [
    {
      role: "user",
      content: `
Analyze the following code or project description. Respond with a single word: 'node' or 'react'. 
If it does not fit either, respond exactly with: 'cannot process'.
Do not include extra text.

Project description or code:
${prompt}
      `,
    },
  ];

  try {
    // Call AI service
    const answer = (await callGemini(messages, 200)).trim().toLowerCase().split(" ")[0];


    if (answer === "cannot process") {
  return res.status(400).json({ error: "AI cannot process this project type" });
}


    if (answer === "react") {
      const response: TemplateResponse = {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n  - .gitignore\n  - package-lock.json`,
        ],
        uiPrompts: [reactBasePrompt],
      };
      return res.json(response);
    } else if (answer === "node") {
      const response: TemplateResponse = {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n  - .gitignore\n  - package-lock.json`,
        ],
        uiPrompts: [nodeBasePrompt],
      };
      return res.json(response);
    } else {
      const errorResponse: ErrorResponse = { error: "AI cannot process this project type" };
      return res.status(400).json(errorResponse);
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorResponse = { error: "Failed to process template request" };
    return res.status(500).json(errorResponse);
  }
});

export default router;
