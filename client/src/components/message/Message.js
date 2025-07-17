import React from 'react';

function Message({ message }) {
    const messageClass = message.sender === 'user' ? 'user' : 'bot';
    return (
        <div className={`chat-message ${messageClass}`}>
            <div className={`message-bubble ${messageClass}`}>
                {message.text}
            </div>
        </div>
    );
}

export default Message;