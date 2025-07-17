import React from 'react';
import chatbot from '../../images/chatbot.png';

function ChatBubble({ onClick }) {
    return (
        <div className="chat-bubble" onClick={onClick}>
            {/* Using an inline SVG for the chat icon */}
            <img src={chatbot} alt='Chat Icon' className="chat-icon" />
            <span className="need-help-text">NEED HELP?</span>
        </div>
    );
}

export default ChatBubble;