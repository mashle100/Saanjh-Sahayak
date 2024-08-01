import React, { useState } from "react";
import axios from "axios";
import "./chatbot.css"; // Import the CSS file

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
    setIsLoading(true); // Start loading animation and disable button

    try {
      const res=await axios.post("http://localhost:5000/api/chat",{
        userMessage:inputText,
      })
      const chatId=res.data._id;
      const requestBody = {
        prompt: inputText,
        chatHistory: updatedMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      };
      console.log(requestBody);
      const botRes = await axios.post("http://localhost:5000/ask", requestBody);
      const botMessageText = botRes.data.answer;
      await axios.put(`http://localhost:5000/api/chat/${chatId}`,{
        botMessage:botMessageText,
      })
      const botMessage={text:botMessageText,sender:"bot"};
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching data:", error); // Log the detailed error
      const errorMessage = { text: "Error fetching response.", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // Stop loading animation and enable button
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
        {isLoading && <div className="typing-indicator">AI is typing...</div>}
      </div>
      <div className="chat-input">
        <textarea
          className="text-box"
          placeholder="Enter your query..."
          value={inputText}
          onChange={handleInputChange}
        ></textarea>
        <button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
