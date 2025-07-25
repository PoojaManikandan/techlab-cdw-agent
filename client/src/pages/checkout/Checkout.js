import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Checkout.css'; // Dedicated CSS for this component
import PayPalIntegration from '../../containers/payPalIntegration/PayPalIntegration';

function Checkout({ shipping = 10.00 }) {
    const [subtotal, setSubtotal] = useState(0);
    const orderTotal = subtotal + shipping;
    const PRODUCT_SERVER_URL = window.REACT_APP_PRODUCT_SERVER_URL
    useEffect(() => {
         axios.get(`${PRODUCT_SERVER_URL}/cart/1234`)
            .then(response => {
                setSubtotal(response.data.total_price || 0);
            })
            .catch(error => {
                console.error('Error fetching cart subtotal:', error);
            });
    }, []);

    const handleReviewOrder = () => {
        alert('Reviewing your order!');
        // In a real application, this would navigate to a review page
        // or trigger further checkout steps.
    };

    return (
        <div className="checkout-full-main-content">
                <div className="checkout-full-left-column">
                    {/* Shipping Address Section */}
                    <div className="checkout-full-section">
                        <div className="checkout-full-section-header">
                            <span className="checkout-full-step-icon checkout-full-completed">✔</span>
                            <h2 className="checkout-full-section-title">Shipping Address</h2>
                            <button className="checkout-full-edit-button">Edit</button>
                        </div>
                        <div className="checkout-full-address-details">
                            <p>Pooja M</p>
                            <p>test</p>
                            <p>Name/Attention: Pooja M</p>
                            <p>143 Alta Dr</p>
                            <p>Girdwood, AK 99587</p>
                        </div>
                    </div>

                    {/* Delivery Method Section */}
                    <div className="checkout-full-section">
                        <div className="checkout-full-section-header">
                            <span className="checkout-full-step-icon checkout-full-completed">✔</span>
                            <h2 className="checkout-full-section-title">Delivery Method</h2>
                            <button className="checkout-full-edit-button">Edit</button>
                        </div>
                        <div className="checkout-full-delivery-details">
                            <p><strong>Shipped</strong></p>
                            <p>2 items</p>
                            <p>UPS Ground AK & HI</p>
                            <p>Monday, July 28, 2025 (Ground) $74.93</p>
                        </div>
                    </div>

                    {/* Billing & Payment Section (Indicator only) */}
                    <div className="checkout-full-section-indicator">
                        <span className="checkout-full-step-icon checkout-full-current">3</span>
                        <h2 className="checkout-full-section-title">Billing & Payment</h2>
                    </div>
                    {/* PayPal Integration Placeholder (below the Order Summary) */}
                    <div className="checkout-full-paypal-placeholder">
                        <h3>Payment Options</h3>
                        <PayPalIntegration amount={orderTotal} currency="USD" />
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="checkout-full-right-column">
                    <div className="checkout-full-order-summary">
                        <h2 className="checkout-full-order-summary-title">Order Summary</h2>
                        <div className="checkout-full-order-summary-row">
                            <span className="checkout-full-order-summary-label">Subtotal</span>
                            <span className="checkout-full-order-summary-value">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="checkout-full-order-summary-row">
                            <span className="checkout-full-order-summary-label">Shipping</span>
                            <span className="checkout-full-order-summary-value">${shipping.toFixed(2)}</span>
                        </div>
                        <div className="checkout-full-order-summary-divider"></div>
                        <div className="checkout-full-order-summary-row checkout-full-order-total">
                            <span className="checkout-full-order-summary-label">Order Total</span>
                            <span className="checkout-full-order-summary-value">${orderTotal.toFixed(2)}</span>
                        </div>
                        <button className="checkout-full-review-button" onClick={handleReviewOrder}>
                            Review Your Order
                        </button>
                    </div>

                    
                </div>
            </div>
    );
}

export default Checkout;