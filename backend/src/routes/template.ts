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
Analyze the following project description and determine the project type.

Rules:
- If it mentions "React", "frontend", "UI", "website", "web app", "component", or describes a user interface → respond with: react
- If it mentions "API", "backend", "Express", "server", "REST", "endpoint", "Node.js server", or describes server-side logic → respond with: node
- If unclear, default to: react

Respond with ONLY ONE WORD: either "react" or "node"

Project description:
${prompt}
      `,
    },
  ];

  try {
    // Call AI service
    const answer = (await callGemini(messages, 200)).trim().toLowerCase().split(" ")[0];


    console.log(`Detected project type: ${answer}`);

    if (answer === "node" || answer.includes("express") || answer.includes("backend")) {
      // Node.js/Express backend project
      const response: TemplateResponse = {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n  - .gitignore\n  - package-lock.json`,
        ],
        uiPrompts: [nodeBasePrompt],
      };
      return res.json(response);
    } else {
      // Default to React for frontend/UI projects
      const response: TemplateResponse = {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n  - .gitignore\n  - package-lock.json`,
        ],
        uiPrompts: [reactBasePrompt],
      };
      return res.json(response);
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorResponse = { error: "Failed to process template request" };
    return res.status(500).json(errorResponse);
  }
});

export default router;
