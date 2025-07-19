import React from 'react';

function Message({ message }) {
    const messageClass = message.sender === 'user' ? 'user' : 'bot';
    return (
        <div className={`chat-message ${messageClass}`}>
            <div className={`message-bubble ${messageClass}`}>
                {/* Render HTML for bot messages, plain text for user */}
                {message.sender === 'bot' ? (
                    <span dangerouslySetInnerHTML={{ __html: message.text }} />
                ) : (
                    message.text
                )}
            </div>
        </div>
    );
}

export default Message;