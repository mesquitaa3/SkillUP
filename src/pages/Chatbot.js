import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/chatbot.css"; // Estilo básico para o chatbot

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    const newMessage = { user: userInput };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput("");

    // Enviar a pergunta para o backend e receber a resposta
    try {
      const response = await axios.post("http://localhost:3001/api/chat", { question: userInput });
      const botReply = { bot: response.data.answer };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Erro ao obter resposta do bot:", error);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <div className="chatbot-box">
          {messages.map((msg, index) => (
            <div key={index} className={msg.user ? "chatbot-user-message" : "chatbot-bot-message"}>
              {msg.user || <div dangerouslySetInnerHTML={{ __html: msg.bot }} />}
            </div>
          ))}
        </div>
        <div className="chatbot-input-container">
          <input
            className="chatbot-input"
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Faça uma pergunta..."
          />
          <button className="chatbot-button" onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
