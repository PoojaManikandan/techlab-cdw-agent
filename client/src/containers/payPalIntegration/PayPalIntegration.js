import React, { useEffect, useRef, useState } from "react";
import "./PayPalIntegration.css"; // Dedicated CSS for PayPal component
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Paypal from "../../components/paypal/Paypal.jsx";


function PayPalIntegration({ amount, currency = "USD" }) {
    
  return (
    <div className="paypal-integration-container">
      <PayPalScriptProvider
        options={{
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
          currency: currency,
          intent: "capture",
        }}
      >
        <Paypal totalAmount={amount} />
      </PayPalScriptProvider>
    </div>
  );
}

export default PayPalIntegration;
