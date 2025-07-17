import React from 'react';
import './OrderConfirmation.css'; // Dedicated CSS for this page
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
    // Mock Data for the Order Confirmation Page
    const confirmedOrderDetails = {
        orderNumber: 'CDW987654321', // A new mock order number
        confirmationMessage: 'Your order has been placed successfully!',
        estimatedDelivery: 'within 5-7 business days',
        trackingLink: '#', // Placeholder for actual tracking link
        shippingAddress: {
            name: 'Pooja M',
            address1: '143 Alta Dr',
            city: 'Girdwood',
            state: 'AK',
            zip: '99587',
        },
        paymentSummary: 'Visa ending in **** 1234',
        orderTotal: 104.36, // Example total based on previous calculations (29.43 + 74.93)
    };
    const navigate = useNavigate();

    const handleViewOrderDetails = () => {
        alert('Navigating to Order Details for Order #' + confirmedOrderDetails.orderNumber);
        // In a real app, this would redirect to a detailed order history page
    };

    const handleContinueShopping = () => {
        navigate('/')
        // In a real app, this would redirect to the homepage or product listing
    };

    return (
        <div className="order-confirm-page-container">

            {/* Main Content Area */}
            <div className="order-confirm-page-main-content">
                <div className="order-confirm-page-card">
                    <div className="order-confirm-page-success-icon">✔</div>
                    <h1 className="order-confirm-page-title">{confirmedOrderDetails.confirmationMessage}</h1>
                    <p className="order-confirm-page-message">
                        Thank you for your purchase! Your order number is:
                    </p>
                    <h2 className="order-confirm-page-order-number">{confirmedOrderDetails.orderNumber}</h2>
                    <p className="order-confirm-page-details-line">
                        Estimated delivery: <span className="order-confirm-page-highlight">{confirmedOrderDetails.estimatedDelivery}</span>
                        {confirmedOrderDetails.trackingLink && (
                            <> | <a href={confirmedOrderDetails.trackingLink} className="order-confirm-page-tracking-link">Track Order</a></>
                        )}
                    </p>

                    <div className="order-confirm-page-summary-sections">
                        <div className="order-confirm-page-summary-box">
                            <h3>Shipping Address</h3>
                            <p>
                                {confirmedOrderDetails.shippingAddress.name}<br />
                                {confirmedOrderDetails.shippingAddress.address1}<br />
                                {confirmedOrderDetails.shippingAddress.city}, {confirmedOrderDetails.shippingAddress.state} {confirmedOrderDetails.shippingAddress.zip}
                            </p>
                        </div>
                        <div className="order-confirm-page-summary-box">
                            <h3>Payment</h3>
                            <p>{confirmedOrderDetails.paymentSummary}</p>
                            <p className="order-confirm-page-total-line">
                                Total Charged: <span className="order-confirm-page-highlight">${confirmedOrderDetails.orderTotal.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>

                    <div className="order-confirm-page-actions">
                        <button className="order-confirm-page-action-button primary" onClick={handleViewOrderDetails}>
                            View Order Details
                        </button>
                        <button className="order-confirm-page-action-button secondary" onClick={handleContinueShopping}>
                            Continue Shopping
                        </button>
                    </div>

                    <p className="order-confirm-page-email-note">
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;