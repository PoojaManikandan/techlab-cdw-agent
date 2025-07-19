import React from 'react';
import './MiniOrderCard.css'; // Shared CSS for mini components

function MiniOrderCard({ orderNumber, status, deliveryDate, itemsCount }) {
    return (
        <div className="mini-card order-card">
            <div className="mini-card-header">
                <h3>Order: {orderNumber}</h3>
                <span className={`status ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
            </div>
            <div className="mini-card-content">
                <p>Est. Delivery: <strong>{deliveryDate}</strong></p>
                <p>{itemsCount} items in this order</p>
            </div>
            <div className="mini-card-footer">
                <button className="mini-card-action-button">View Details</button>
            </div>
        </div>
    );
}

export default MiniOrderCard;