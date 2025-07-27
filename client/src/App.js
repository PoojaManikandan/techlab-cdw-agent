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
// import AiChatbot from './containers/aiChatbot/AiChatbot';
import AiModeToggle from './containers/aiModeToggle/AiModeToggle';
import Login from './components/login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  const [isNormalMode, setIsNormalMode] = useState(false);

  return (
    <Router>
      {isNormalMode ? (
        <AiModeToggle isNormalMode={isNormalMode} setIsNormalMode={setIsNormalMode} />
      ) : (
        <>
          <Header logo="/path/to/logo.png" isNormalMode={isNormalMode} setIsNormalMode={setIsNormalMode} />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                // <ProtectedRoute>
                  <PDP />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/details/:cdw"
              element={
                <ProtectedRoute>
                  <ProductDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <ShoppingCart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderConfirmation"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Chatbot />
        </>
      )}
    </Router>
  );
};

export default App;