import React, { useState } from 'react';
import './MiniOrderConfirmation.css'; // Dedicated CSS for this component

function MiniOrderConfirmation({orderDetails}) {
    // Default product structure based on the provided screenshot
    const defaultOrderDetails = {
        orderNumber: 'CDW987654321',
        estimatedDelivery: '5-7 business days',
        shippingAddress: {
            name: 'Pooja M',
            addressLine1: '143 Alta Dr',
            cityStateZip: 'Girdwood, AK 99587'
        },
        payment: {
            cardType: 'Visa',
            lastFourDigits: '1234',
            totalCharged: '104.36'
        },
        email: 'registered@example.com' // Placeholder for confirmation email info
    };

    const order = orderDetails || defaultOrderDetails;

    const handleViewOrderDetails = () => {
        alert('Navigating to full order details for ' + order.orderNumber);
        // In a real app, this would navigate to a detailed order history page
    };

    const handleContinueShopping = () => {
        alert('Navigating back to shopping...');
        // In a real app, this would navigate to the homepage or product listings
    };

    return (
        <div className="order-confirmation-card-container">
            <div className="order-confirmation-header">
                <div className="success-icon-wrapper">
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#28a745" strokeWidth="2.5"/>
                        <path d="M8 12.5L11 15.5L16 9.5" stroke="#28a745" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className="order-success-title">Your order has been placed successfully!</h2>
                <p className="order-thank-you">Thank you for your purchase! Your order number is: </p>
                <p className="order-number">{order.orderNumber}</p>
                <p className="order-delivery-info">
                    Estimated delivery: <span className="highlight-text">{order.estimatedDelivery}</span> | <a href="#" className="track-order-link">Track Order</a>
                </p>
            </div>

            <div className="order-confirmation-details-grid">
                <div className="order-details-card">
                    <h3>Shipping Address</h3>
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>{order.shippingAddress.cityStateZip}</p>
                </div>
                <div className="order-details-card">
                    <h3>Payment</h3>
                    <p>{order.payment.cardType} ending in **** {order.payment.lastFourDigits}</p>
                    <p>Total Charged: <span className="highlight-text">${order.payment.totalCharged}</span></p>
                </div>
            </div>

            <div className="order-confirmation-actions">
                <button className="btn btn-dark" onClick={handleViewOrderDetails}>
                    View Order Details
                </button>
                <button className="btn btn-outline-primary" onClick={handleContinueShopping}>
                    Continue Shopping
                </button>
            </div>

            <p className="order-confirmation-email-note">
                A confirmation email has been sent to your registered email address.
            </p>
        </div>
    );
}

export default MiniOrderConfirmation;