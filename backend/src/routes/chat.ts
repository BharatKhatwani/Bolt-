import { Router } from 'express';
import { callGemini } from '../servers/ai.js';
import { getSystemPrompt } from '../prompt.js';

const router = Router();

router.post('/', async (req, res) => {
  // Ensure messages is an array
  const userMessages = Array.isArray(req.body.messages) ? req.body.messages : [];

  if (userMessages.length === 0) {
    const errorResponse = { error: 'Messages are required and must be a non-empty array' };
    return res.status(400).json(errorResponse);
  }

  try {
    
    const messages = [
      { role: 'user', content: getSystemPrompt() },
      ...userMessages,
    ];

    const aiOutput = await callGemini(messages, 10000);

    const response = { response: aiOutput };
    return res.json(response);
 } catch (error) {
    console.error(error);
    const errorResponse = { error: 'Failed to process chat request' };
    return res.status(500).json(errorResponse);
  }
});

export default router;
