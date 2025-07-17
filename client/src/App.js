import React from 'react';
import Header from './components/Header';
import './App.css';
import PDP from './components/pdp/Pdp';
import Chatbot from './containers/chatbot/Chatbot';

const App = () => {
  const links = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div>
      <Header logo="/path/to/logo.png" links={links} />
      {/* Other components */}
      <PDP />
      <Chatbot />
    </div>
  );
};

export default App;
