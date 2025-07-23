import React, { useState } from 'react';
import './AiModeToggle.css'; // Dedicated CSS for this component
import AiChatbot from '../aiChatbot/AiChatbot';
import MiniCart from '../miniCart/MiniCart';
import chatbotlogo from '../../images/chatbot.png'; // Adjust the path as necessary
import cdwlogo from '../../images/cdwWhite.png'
import OrderConfirmation from '../../pages/orderConfirmation/OrderConfirmation';
import MiniOrderConfirmation from '../miniOrderConfirmation/MiniOrderConfirmation';

function AiModeToggle({isNormalMode, setIsNormalMode}) {

     const toggleMode = () => {
    setIsNormalMode(!isNormalMode);
  };

    return (

        <div className="ai-mode-toggle-container">
          <header className="ai-chatbot-header">
                <div className="ai-chatbot-logo">
                    <img src={cdwlogo} alt="logo" width={80} />
                </div>
            <div className="toggle-wrapper">
                        <label htmlFor="mode-toggle" className="toggle-label">
                          <div className="toggle-container"> {/* Added a container for positioning */}
                            <input
                              type="checkbox"
                              id="mode-toggle"
                              className="toggle-input"
                              checked={isNormalMode}
                              onChange={toggleMode}
                            />
                            <div className={`toggle-background ${isNormalMode ? 'normal-mode-bg' : 'dark-mode-bg'}`}></div>
                            <div className="toggle-dot">
                                {isNormalMode ?<span class="toggle-icon"><img src={chatbotlogo} alt='logo' /></span>: ''}
                            </div>
                          </div>
                          <div className={`toggle-text ${isNormalMode ? 'normal-mode-text' : 'dark-mode-text'}`}>
                            {isNormalMode ? 'AI MODE' : 'NORMAL MODE'}
                          </div>
                        </label>
                      </div>
            </header>
            {/* Main Content Area */}
            <div className="ai-mode-toggle-main-content">
                    <>

                        <div className="ai-mode-chatbot-section">
                            <AiChatbot /> {/* Render the full-screen chatbot */}
                        </div>
                        <div className='vertical-separator'></div>
                        <MiniCart />
                        {/* <MiniOrderConfirmation /> */}
                    </>
                
            </div>

        </div>
    );
}

export default AiModeToggle;