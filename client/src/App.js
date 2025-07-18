import React from 'react';
import Header from './components/Header';
import './App.css';
import PDP from './components/pdp/Pdp';
import Chatbot from './containers/chatbot/Chatbot';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from './components/checkout/Checkout';

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
        
        <PayPalScriptProvider options={{
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture"
        }}>
          <Checkout />
        </PayPalScriptProvider>
      
    </div>
  );
};

export default App;
