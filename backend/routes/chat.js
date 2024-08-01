const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// Add a chat message
router.post("/", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const newChat = new Chat({ userMessage, botMessage: "" });
    const chat = await newChat.save();
    res.json(chat);
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({ error: "Error saving chat message." });
  }
});

// Update chat message with bot response
router.put("/:id", async (req, res) => {
  const { botMessage } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { botMessage },
      { new: true }
    );
    res.json(chat);
  } catch (error) {
    console.error("Error updating chat message:", error);
    res.status(500).json({ error: "Error updating chat message." });
  }
});

// Get all chat messages
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Error fetching chat messages." });
  }
});

module.exports = router;
// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// // Middleware to parse JSON
// router.use(express.json());

// // Handle POST request to send a message to the chatbot
// router.post('/ask', async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }

//   try {
//     // Forward the message to the LLaMa 2 API or similar
//     const response = await axios.post('YOUR_LLM_API_ENDPOINT', {
//       prompt: message,
//       // Include any necessary parameters here
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     // Send the response back to the client
//     res.json({ response: response.data });
//   } catch (error) {
//     console.error('Error communicating with the LLM API:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Handle GET request to fetch conversation history
// router.get('/history', async (req, res) => {
//   try {
//     // Example logic for fetching conversation history
//     // You would replace this with your actual implementation
//     const history = []; // Fetch history from your database or other source

//     res.json({ history });
//   } catch (error) {
//     console.error('Error fetching conversation history:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;
