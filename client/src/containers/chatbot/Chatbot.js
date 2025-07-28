import React, { useState, useEffect, use } from 'react';
import './Chatbot.css'; // Import the main chatbot CSS
import ChatWindow from '../../components/chatWindow/ChatWindow';
import ChatBubble from '../../components/chatBubble/ChatBubble';
import { useNavigate } from 'react-router-dom';

import apiClient from '../../api/api';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]); // For API context
    const navigate = useNavigate();
    const ADK_SERVER_URL = window.REACT_APP_API_GATEWAY_URL;

    // Initial welcome message
    useEffect(() => {
        setMessages([
            { sender: 'bot', text: "Hi there I'm CDW Agent, I'm helpful in fetching products, order processing, quote creation etc! How can I assist you today?" }
        ]);
    }, []);

    const handleSendMessage = async (text) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            setMessages((prevMessages) => [
                        ...prevMessages,
                        { sender: 'bot', text: 'Try logging in first and try to chat again' }
            ]);
            return; // Stop further processing
        }
        const newUserMessage = { sender: 'user', text: text };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setChatHistory((prevHistory) => [...prevHistory, { role: "user", parts: [{ text: text }] }]);
        setIsLoading(true);

        try {
            const SESSION_ID = localStorage.getItem("sessionId");
            const ADK_APP_NAME = localStorage.getItem("adkAppName");
            const userId = localStorage.getItem("userId");
            const requestBody = { text }; // or customize as needed
            let detailsIds = [];

            console.log('ADK_SERVER_URL:', ADK_SERVER_URL);
            if(true){
                apiClient.post(`${ADK_SERVER_URL}/run`, {
                    appName: ADK_APP_NAME,
                    userId: userId,
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
                    // Find all /details/7digit matches
                    const detailsMatches = [...text.matchAll(/\/details\/(\d{7})/g)];
                    detailsIds = detailsMatches.map(m => m[1]);
                    // Remove all /details/7digit from text
                    text = text.replace(/\/details\/(\d{7})/g, '');
                    // Match /cart and /checkout
                    let cart = null;
                    let checkout = null;
                    if (/\/cart/.test(text)) {
                        cart = '/cart';
                        text = text.replace(/\/cart/g, '');
                    }
                    if (/\/checkout/.test(text)) {
                        checkout = '/checkout';
                        text = text.replace(/\/checkout/g, '');
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
                    if (detailsIds.length === 1) {
                        navigate(`/details/${detailsIds[0]}`);
                    }
                    if (cart) {
                        navigate(cart);
                    }
                    if (checkout) {
                        navigate(checkout);
                    }
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