import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // Import the main chatbot CSS
import ChatWindow from '../../components/chatWindow/ChatWindow';
import ChatBubble from '../../components/chatBubble/ChatBubble';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]); // For API context

    // Initial welcome message
    useEffect(() => {
        setMessages([
            { sender: 'bot', text: 'Hi there! How can I assist you today?' }
        ]);
    }, []);

    const handleSendMessage = async (text) => {
        const newUserMessage = { sender: 'user', text: text };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setChatHistory((prevHistory) => [...prevHistory, { role: "user", parts: [{ text: text }] }]);
        setIsLoading(true);

        try {
            // --- API Call to Gemini API ---
            // Replace with your actual API key or leave empty for Canvas runtime
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const payload = { contents: chatHistory }; // Send full chat history for context

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            let botResponseText = "Sorry, I couldn't get a response. Please try again.";

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                botResponseText = result.candidates[0].content.parts[0].text;
            } else {
                console.error("Unexpected API response structure:", result);
            }

            const newBotMessage = { sender: 'bot', text: botResponseText };
            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
            setChatHistory((prevHistory) => [...prevHistory, { role: "model", parts: [{ text: botResponseText }] }]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Oops! Something went wrong. Please try again later.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClose={() => setIsOpen(false)}
                    isLoading={isLoading}
                />
            )}
            <ChatBubble onClick={() => setIsOpen(!isOpen)} />
        </div>
    );
}

export default Chatbot;