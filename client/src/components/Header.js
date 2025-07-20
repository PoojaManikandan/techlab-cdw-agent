import React, { useState } from 'react';
import { Bell, User, ShoppingCart } from 'lucide-react';
import './Header.css'; // Import the CSS file
import logo from '../images/logo.png'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import chatbotlogo from '../images/chatbotlogo.png'; 

function Header({isNormalMode, setIsNormalMode}) {
  
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsNormalMode(!isNormalMode);
  };

  return (
    <header className="w-full">
      {/* Main Header Section */}
      <div className="header-main">
        <div className="header-container">
          {/* CDW Logo */}
          <div className="cdw-logo">
            <img
              src={logo} // Placeholder image
              alt="CDW Logo"
              onClick={() => {
                
                navigate('/'); // Navigate to home on logo click
              }}
            />
          </div>

          {/* Icons and User Actions */}
          <div className="header-icons">
            <div className="icon-item">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </div>
            <div className="icon-item">
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </div>
            <div className="icon-item" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="header-nav">
        <div className="header-nav-container">
          <div className="nav-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Hardware</a>
            <a href="#">Software</a>
            <a href="#">Services</a>
            <a href="#">IT Solutions</a>
            <a href="#">Brands</a>
            <a href="#">Research Hub</a>
          </div>

          {/* Mode Toggle Switch */}
          <div className="mode-toggle-wrapper">
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
        </div>
      </nav>
    </header>
  );
}

export default Header;