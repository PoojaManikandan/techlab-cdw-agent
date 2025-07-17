import React, { useEffect, useRef, useState } from 'react';
import './PayPalIntegration.css'; // Dedicated CSS for PayPal component

function PayPalIntegration({ amount, currency = 'USD' }) {
    const paypalButtonContainerRef = useRef(null);
    const [sdkReady, setSdkReady] = useState(false);
    const [error, setError] = useState(null);

    // Replace with your actual PayPal Client ID (from your PayPal Developer Dashboard)
    // In a real application, fetch this securely from environment variables or a backend.
    const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID'; // <<< IMPORTANT: Replace this!

    useEffect(() => {
        // Function to load the PayPal SDK script
        const loadPayPalScript = () => {
            if (window.paypal) {
                setSdkReady(true);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
                console.log('PayPal SDK loaded successfully.');
            };
            script.onerror = (err) => {
                console.error('Failed to load PayPal SDK:', err);
                setError('Failed to load PayPal payment options. Please try again later.');
            };
            document.body.appendChild(script);
        };

        if (!sdkReady) {
            loadPayPalScript();
        }

        // Cleanup function for the script (optional, but good practice for SPA)
        return () => {
            if (paypalButtonContainerRef.current) {
                // If buttons were rendered, destroy them
                // This might not always be needed if your app structure re-renders often
                paypalButtonContainerRef.current.innerHTML = '';
            }
            // You might want to remove the script tag if navigating away,
            // but for a single page checkout, it's usually fine to keep.
        };
    }, [sdkReady, currency, PAYPAL_CLIENT_ID]); // Re-run if SDK ready state or currency changes

    useEffect(() => {
        if (sdkReady && paypalButtonContainerRef.current) {
            // Ensure the container is empty before rendering to prevent duplicates
            paypalButtonContainerRef.current.innerHTML = '';

            try {
                window.paypal.Buttons({
                    // Set up the transaction when the button is clicked
                    createOrder: (data, actions) => {
                        // This is where you would typically make an API call to your backend
                        // to create a PayPal order and return the order ID.
                        // Example:
                        // return fetch('/api/paypal/create-order', {
                        //     method: 'POST',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //     },
                        //     body: JSON.stringify({
                        //         amount: amount,
                        //         currency: currency,
                        //     }),
                        // })
                        // .then(response => response.json())
                        // .then(order => order.id);

                        // For demonstration, we'll create a dummy order client-side (NOT for production)
                        console.log('Creating PayPal order for amount:', amount);
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    currency_code: currency,
                                    value: amount.toFixed(2),
                                },
                            }],
                        });
                    },
                    // Finalize the transaction after the buyer approves the payment
                    onApprove: (data, actions) => {
                        // This is where you would typically make an API call to your backend
                        // to capture the payment using the order ID.
                        // Example:
                        // return fetch(`/api/paypal/capture-order/${data.orderID}`, {
                        //     method: 'POST',
                        // })
                        // .then(response => response.json())
                        // .then(orderData => {
                        //     console.log('Order Captured!', orderData);
                        //     // Handle successful payment (e.g., show success message, update UI)
                        // });

                        // For demonstration, simulate capture (NOT for production)
                        console.log('PayPal payment approved. Order ID:', data.orderID);
                        alert(`Payment Approved! Order ID: ${data.orderID}`);
                        return actions.order.capture().then(function(details) {
                            console.log('Transaction completed by ' + details.payer.name.given_name + '!');
                            // Handle successful payment, e.g., show a success message
                            alert('Transaction completed by ' + details.payer.name.given_name + '!');
                        });
                    },
                    // Handle cases where the buyer cancels the payment
                    onCancel: (data) => {
                        console.log('Payment cancelled by buyer:', data);
                        alert('Payment cancelled.');
                    },
                    // Handle errors during the payment process
                    onError: (err) => {
                        console.error('PayPal button error:', err);
                        setError('There was an error processing your PayPal payment. Please try again.');
                    }
                }).render(paypalButtonContainerRef.current);
            } catch (err) {
                console.error("Error rendering PayPal buttons:", err);
                setError("Could not render PayPal buttons. Check your CLIENT_ID.");
            }
        }
    }, [sdkReady, amount, currency]); // Re-render buttons if amount or currency changes

    if (error) {
        return <div className="paypal-error-message">{error}</div>;
    }

    if (!sdkReady) {
        return <div className="paypal-loading-message">Loading PayPal options...</div>;
    }

    return (
        <div className="paypal-integration-container">
            <h3>Pay with PayPal</h3>
            {/* PayPal buttons will be rendered here */}
            <div ref={paypalButtonContainerRef} className="paypal-buttons-wrapper"></div>
            <p className="paypal-note">
                (This is a client-side example. Real integration requires server-side order creation and capture.)
            </p>
        </div>
    );
}

export default PayPalIntegration;