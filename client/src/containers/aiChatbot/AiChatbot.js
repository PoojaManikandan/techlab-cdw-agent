import React, { useState, useRef, useEffect } from 'react'; // Added useEffect
import './AiChatbot.css'; // Dedicated CSS for this component
import MiniOrderCard from '../miniOrderCard/MiniOrderCard';
import MiniProductCard from '../miniProductCard/MiniProductCard';
import cdwlogo from '../../images/cdwWhite.png'
import PayPalIntegration from '../payPalIntegration/PayPalIntegration';

function AiChatbot() {
    // Messages can now contain 'text' or 'component'
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const userMessageText = inputValue.trim();
            setMessages(prevMessages => [...prevMessages, { type: 'text', text: userMessageText, sender: 'user' }]);
            setInputValue('');

            // Simulate AI response with a delay
            setTimeout(() => {
                const aiResponseContent = getAiResponse(userMessageText);
                setMessages(prevMessages => [...prevMessages, { type: aiResponseContent.type, content: aiResponseContent.content, sender: 'ai' }]);
            }, 1000);
        }
    };

    const getAiResponse = (userMessage) => {
        // make api call for now considering userMessage as a response 
        userMessage = userMessage.toLowerCase();
        if (userMessage.includes('product') || userMessage.includes('product info')) {
            return {
                type: 'component',
                content: {
                    component: 'MiniProductCard',
                    props: [
                        {
                        name: 'StarTech.com 6ft HDMI Cable',
                        price: '$13.29',
                        cdwPart: '3036583',
                        imageUrl: 'http://googleusercontent.com/file_content/2'
                    },
                    {
                        name: 'StarTech.com 6ft HDMI Cable',
                        price: '$13.29',
                        cdwPart: '3036583',
                        imageUrl: 'http://googleusercontent.com/file_content/2'
                    },
                        {
                        name: 'StarTech.com 6ft HDMI Cable',
                        price: '$13.29',
                        cdwPart: '3036583',
                        imageUrl: 'http://googleusercontent.com/file_content/2'
                    },
                    {
                        name: 'StarTech.com 6ft HDMI Cable',
                        price: '$13.29',
                        cdwPart: '3036583',
                        imageUrl: 'http://googleusercontent.com/file_content/2'
                    },
                        {
                        name: 'StarTech.com 6ft HDMI Cable',
                        price: '$13.29',
                        cdwPart: '3036583',
                        imageUrl: 'http://googleusercontent.com/file_content/2'
                    },
                    {
                        name: 'StarTech.com 6ft HDMI Cable',
                        price: '$13.29',
                        cdwPart: '3036583',
                        imageUrl: 'http://googleusercontent.com/file_content/2'
                    },
                    ]
                }
            };
        } else if (userMessage.includes('payment')) {
            return {
                type: 'component',
                content: {
                    component: 'Payment',
                }

            }

        }
    };

    const renderMessageContent = (msg) => {
        if (msg.type === 'text') {
            return msg.text;
        } else if (msg.type === 'component') {
            switch (msg.content.component) {
                case 'MiniOrderCard':
                    return <MiniOrderCard {...msg.content.props} />;
                case 'MiniProductCard':
                    return <MiniProductCard products={msg.content.props} />;
                case 'Payment':
                    return <div className="payment-component"><PayPalIntegration amount={2323} currency="USD"  /></div>;
                default:
                    return <p>Unknown component</p>;
            }
        }
        return null;
    };

    return (
        <div className="ai-chatbot-container">            

            {/* Chat Message Area */}
            <div className="ai-chatbot-chat-area" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`ai-chatbot-message ${msg.sender}`}>
                        {renderMessageContent(msg)}
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="ai-chatbot-welcome-message">
                        Ask me anything about order status, stock availability, or technical support.
                        <br/>Try typing "order status" or "cable product info".
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="ai-chatbot-input-area">
                <input
                    type="text"
                    className="ai-chatbot-input"
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(event) => event.key === 'Enter' ? handleSendMessage() : null}
                />
                <button className="ai-chatbot-send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default AiChatbot;