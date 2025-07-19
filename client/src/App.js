import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import PDP from './pages/pdp/Pdp';
import Chatbot from './containers/chatbot/Chatbot';
import ProductDetailsPage from './pages/productDetailsPage/ProductDetailsPage';
import ShoppingCart from './pages/shoppingCart/ShoppingCart';
import Checkout from './pages/checkout/Checkout';
import OrderConfirmation from './pages/orderConfirmation/OrderConfirmation';
import AiChatbot from './containers/aiChatbot/AiChatbot';
import AiModeToggle from './containers/aiModeToggle/AiModeToggle';

const App = () => {
  const [isNormalMode, setIsNormalMode] = useState(false);

  return (
    <Router>
      {isNormalMode?<AiModeToggle isNormalMode={isNormalMode} setIsNormalMode={setIsNormalMode} /> :<>
      <Header logo="/path/to/logo.png" isNormalMode={isNormalMode} setIsNormalMode={setIsNormalMode} />
      <Routes>
        <Route path="/" element={<PDP />} />
        <Route path="/details/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderConfirmation" element={<OrderConfirmation />} />
        {/* Add more routes as needed */}
      </Routes>
      <Chatbot /></>}
    </Router>
  );
};

export default App;
