import React from 'react';
import './MiniCart.css'; // Dedicated CSS for this component

function MiniCart() {
    // Mock data for cart items, based on the provided screenshots
    const cartItems = [
        {
            id: '1',
            name: 'HP 6FT 1.83M 10A C13-UL US PWR CORD',
            mfgPart: 'AF566A',
            cdw: '6424237',
            imageUrl: 'http://googleusercontent.com/file_content/2', // Image from screenshot
            originalPrice: 16.99,
            price: 16.14,
            quantity: 1,
            inStock: true
        },
        {
            id: '2',
            name: 'STARTECH 6FT HIGH SPEED HDMI CAB',
            mfgPart: 'HDMM6',
            cdw: '3036583',
            imageUrl: 'http://googleusercontent.com/file_content/2', // Image from screenshot
            originalPrice: 13.99,
            price: 13.29,
            quantity: 1,
            inStock: true
        }
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
        // In a real application, this would navigate to the checkout page
    };

    const handleContinueShopping = () => {
        alert('Continuing shopping...');
        // In a real application, this would navigate to a product listing page or homepage
    };

    return (
        <div className="mini-cart-container">
            <div className="mini-cart-header">
                <h2>Shopping Cart</h2>
            </div>

            {cartItems.length !== 0 ? 
                (<div className="mini-cart-empty">
                    <p>Your cart is empty.</p>
                </div>)
             : 
            (
                <>
            <div className="mini-cart-items-list">
                {cartItems.map(item => (
                    <div key={item.id} className="mini-cart-item">
                        <img src={item.imageUrl} alt={item.name} className="mini-cart-item-image"
                             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/E0E0E0/333333?text=Item'; }}/>
                        <div className="mini-cart-item-info">
                            <p className="mini-cart-item-stock">{item.inStock ? 'In Stock' : 'Out of Stock'}</p>
                            <p className="mini-cart-item-name">{item.name}</p>
                            <p className="mini-cart-item-part-numbers">
                                MFG Part: {item.mfgPart} | CDW#: {item.cdw}
                            </p>
                        </div>
                        <div className="mini-cart-item-price-section">
                            {item.originalPrice && item.originalPrice > item.price && (
                                <span className="mini-cart-original-price">${item.originalPrice.toFixed(2)}</span>
                            )}
                            <span className="mini-cart-current-price">${item.price.toFixed(2)}</span>
                            <div className="mini-cart-qty-input">
                                <label htmlFor={`qty-${item.id}`}>Qty</label>
                                <input
                                    type="number"
                                    id={`qty-${item.id}`}
                                    value={item.quantity}
                                    min="1"
                                    onChange={() => {/* Handle quantity change */}}
                                    className="mini-cart-input-field"
                                />
                            </div>
                            <button className="mini-cart-delete-button" onClick={() => alert('Remove item ' + item.name)}>
                                <span className="mini-cart-delete-icon">🗑️</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mini-cart-summary">
                <p className="mini-cart-subtotal">Subtotal: <span className="mini-cart-subtotal-value">${subtotal.toFixed(2)}</span></p>
                <button className="mini-cart-checkout-button" onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
                </>)}
        </div>
    );
}

export default MiniCart;