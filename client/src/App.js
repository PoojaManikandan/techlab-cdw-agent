import React from 'react';
import Header from './components/Header';
import './App.css';

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
    </div>
  );
};

export default App;
