import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        userMessage: inputText,
      });
      const chatId = res.data._id;
      const requestBody = {
        prompt: inputText,
        chatHistory: updatedMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      };
      const botRes = await axios.post("http://localhost:5000/ask", requestBody);
      const botMessageText = botRes.data.answer;
      await axios.put(`http://localhost:5000/api/chat/${chatId}`, {
        botMessage: botMessageText,
      });
      const botMessage = { text: botMessageText, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Chatbot</h2>
      <div className="border border-gray-300 rounded-lg p-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && <p className="text-gray-500">Loading...</p>}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
