const express = require("express");
const OpenAI = require("openai");
const router = express.Router();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: "your key",
  baseURL: "https://api.llama-api.com",
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
    // Call LLaMA API with the updated chat history
    const response = await client.chat.completions.create({
      model: "llama-13b-chat",
      messages: [
        {
          role: "system",
          content: "Assistant is a large language model trained by OpenAI.",
        },
        ...chatHistory,
      ],
    });

    // Get the response from the model
    const answer = response.choices[0].message.content.trim();

    // Format the response
    const formattedAnswer = answer
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `• ${line.trim()}`)
      .join("\n");

    // Append the assistant's response to the chat history
    chatHistory.push({ role: "assistant", content: answer });

    // Send the formatted response back to the client
    res.json({ answer: formattedAnswer });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching response." });
  }
});

module.exports = router;
