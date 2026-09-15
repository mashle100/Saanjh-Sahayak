const express = require("express");
const OpenAI = require("openai");
const router = express.Router();

// Initialize OpenAI client using environment variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || undefined,
});

// In-memory store for chat history (for simplicity)
let chatHistory = [];

// POST route to handle chat requests
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  // Validate the prompt
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  // Append the new prompt to the chat history
  chatHistory.push({ role: "user", content: prompt });

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set.');
      return res.status(500).json({ error: 'OpenAI API key is not configured on the server.' });
    }

    // Call OpenAI chat completions with the updated chat history
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for a healthcare support app.',
        },
        ...chatHistory,
      ],
    });

    // Extract the assistant message
    const answer = response.choices?.[0]?.message?.content?.trim() || '';

    // Format the response for the frontend
    const formattedAnswer = answer
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => `• ${line.trim()}`)
      .join('\n');

    chatHistory.push({ role: 'assistant', content: answer });
    res.json({ answer: formattedAnswer });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error?.message || error);
    // Return a clear JSON error for the frontend to display
    res.status(500).json({ error: 'Failed to fetch response from OpenAI.' });
  }
});

module.exports = router;
