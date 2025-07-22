import React, { useEffect, useState } from 'react';
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
import Login from './components/login/Login';
import apiClient from './api/api';

const App = () => {
  const [isNormalMode, setIsNormalMode] = useState(false);
  useEffect(()=>{
    (async () => {
      try {
        const res=await apiClient.get("/protected");
      console.log(res,"res");
      } catch (error) {
        console.error("Error fetching protected resource:", error);
        
      }
      
    })();
  },[]);
  return (
    <Router>
      {isNormalMode?<AiModeToggle isNormalMode={isNormalMode} setIsNormalMode={setIsNormalMode} /> :<>
      <Header logo="/path/to/logo.png" isNormalMode={isNormalMode} setIsNormalMode={setIsNormalMode} />
      <Routes>
        <Route path="/" element={<PDP />} />
        <Route path="/details/:cdw" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderConfirmation" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Routes>
      <Chatbot /></>}
    </Router>
  );
};

export default App;
