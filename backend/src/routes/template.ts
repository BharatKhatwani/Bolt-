import { Router } from "express";
import { callGemini } from "../servers/ai.js";
import { BASE_PROMPT } from "../prompt.js";
import { basePrompt as nodeBasePrompt } from "../defaults/node.js";
import { basePrompt as reactBasePrompt } from "../defaults/react.js";
import { basePrompt as javaBasePrompt } from "../defaults/java.js";
import { basePrompt as pythonBasePrompt } from "../defaults/python.js";
import { basePrompt as goBasePrompt } from "../defaults/golang.js";
import { AIMessage, ErrorResponse, TemplateResponse } from "../types/index.js";

const router = Router();

router.post("/", async (req, res) => {
  const prompt = req.body.prompt;

  // Input validation
  if (!prompt || typeof prompt !== "string") {
    const errorResponse: ErrorResponse = { error: "Prompt is required and must be a string" };
    return res.status(400).json(errorResponse);
  }

  // -------------------- AI classification prompt --------------------
  const messages: AIMessage[] = [
    {
      role: "user",
      content: `
Analyze the following project description and determine the primary project type.

Rules:
- If it mentions "React", "frontend", "UI", "website", "web app", "component" → respond with: react
- If it mentions "API", "backend", "Express", "server", "REST", "endpoint", "Node.js" → respond with: node
- If it mentions "Java", "Spring Boot", "JDK", "Maven", "Gradle" → respond with: java
- If it mentions "Python", "Flask", "Django", "FastAPI" → respond with: python
- If it mentions "Go", "Golang", "Gin", "Fiber" → respond with: go
- If unclear → default to: react

Respond with ONLY ONE WORD:
react | node | java | python | go

Project description:
${prompt}
      `,
    },
  ];

  try {
    // Call AI model to detect project type
    const answer = (await callGemini(messages, 200))
      .trim()
      .toLowerCase()
      .split(" ")[0];

    console.log(`🔍 Detected project type: ${answer}`);

    // Helper function to format the response
    const createResponse = (basePrompt: string): TemplateResponse => ({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.
Consider the contents of ALL files in the project.

${basePrompt}

Here is a list of files that exist on the file system but are not being shown to you:
  - .gitignore
  - package-lock.json`,
      ],
      uiPrompts: [basePrompt],
    });

    // -------------------- Match detected type --------------------
    switch (answer) {
      case "node":
      case "express":
      case "backend":
        return res.json(createResponse(nodeBasePrompt));

      case "react":
      case "frontend":
      case "ui":
        return res.json(createResponse(reactBasePrompt));

      case "java":
      case "spring":
      case "springboot":
        return res.json(createResponse(javaBasePrompt));

      case "python":
      case "flask":
      case "django":
      case "fastapi":
        return res.json(createResponse(pythonBasePrompt));

      case "go":
      case "golang":
      case "gin":
      case "fiber":
        return res.json(createResponse(goBasePrompt));

      default:
        // If unclear, default to React
        return res.json(createResponse(reactBasePrompt));
    }
  } catch (error) {
    console.error("❌ Template generation error:", error);
    const errorResponse: ErrorResponse = { error: "Failed to process template request" };
    return res.status(500).json(errorResponse);
  }
});

export default router;
