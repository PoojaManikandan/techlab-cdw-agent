import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // Import the main chatbot CSS
import ChatWindow from '../../components/chatWindow/ChatWindow';
import ChatBubble from '../../components/chatBubble/ChatBubble';
import axios from 'axios';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]); // For API context

    // Initial welcome message
    useEffect(() => {
        setMessages([
            { sender: 'bot', text: "Hi there I'm CDW Agent, I'm helpful in fetching products, order processing, quote creation etc! How can I assist you today?" }
        ]);
    }, []);

    const handleSendMessage = async (text) => {
        const newUserMessage = { sender: 'user', text: text };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setChatHistory((prevHistory) => [...prevHistory, { role: "user", parts: [{ text: text }] }]);
        setIsLoading(true);

        try {
            const SESSION_ID = 's_100';
            const requestBody = { text }; // or customize as needed
            // const response = await axios.post(
            //     `${process.env.REACT_APP_ADK_SERVER_URL}/apps/cdw_agent/users/u_125/sessions/${SESSION_ID}`,
            //     {},
            //     {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            // );

            // if(response.status === 200) {
            if(true){
                axios.post(`${process.env.REACT_APP_ADK_SERVER_URL}/run`, {
                    appName: 'cdw_agent',
                    userId: 'u_125',
                    sessionId: `${SESSION_ID}`,
                    newMessage: {
                        role: 'user',
                        parts: [
                            {
                                text: JSON.stringify(requestBody)
                            }
                        ]
                    }
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    let text = response?.data[response.data.length - 1]?.content?.parts[0]?.text;
                    // Remove surrounding quotes if present
                    if (typeof text === 'string' && text.startsWith('"') && text.endsWith('"')) {
                        text = text.substring(1, text.length - 1);
                    }
                    // Format text: ** to heading, * to bullet, /n to newline
                    text = text
                        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // **heading**
                        .replace(/^\* (.*)$/gm, '<li>$1</li>') // * bullet
                        .replace(/\/n/g, '<br/>'); // /n newline
                    // Add link tag for PayPal sandbox links
                    text = text.replace(/(https:\/\/www\.sandbox\.paypal\.com\/checkoutnow\?token=[A-Za-z0-9]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">PayPal Checkout</a>');
                    const newBotMessage = { sender: 'bot', text };
                    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
                    setChatHistory((prevHistory) => [...prevHistory, { role: "model", parts: [{ text }] }]);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'bot', text: 'Oops! Something went wrong. Please try again later.' }
                    ]);
                    setIsLoading(false);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Oops! Something went wrong. Please try again later.' }
            ]);
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