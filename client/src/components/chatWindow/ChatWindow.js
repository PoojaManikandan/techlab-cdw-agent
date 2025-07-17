import React, { useRef, useEffect } from 'react';
import ChatInput from '../chatInput/ChatInput';
import Message from '../message/Message';

function ChatWindow({ messages, onSendMessage, onClose, isLoading }) {
    const messagesEndRef = useRef(null);

    // Scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-window">
            <div className="chat-window-header">
                <span>NEED HELP?</span>
                <button onClick={onClose}>X</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
                {isLoading && (
                    <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                    </div>
                )}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
    );
}

export default ChatWindow;