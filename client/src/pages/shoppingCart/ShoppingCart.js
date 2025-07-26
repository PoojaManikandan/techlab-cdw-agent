import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShoppingCart.css'; // Dedicated CSS file for this component
import { useNavigate } from 'react-router-dom';

function ShoppingCart() {
    // Mock product data for the cart, now with keys exactly matching the provided object
    // const initialCartItems = [
    //     {
    //         id: '3',
    //         name: 'StarTech.com 6ft HDMI Cable - 4K High Speed HDMI Cable w/ Ethernet - HDMI 1.4 - HDMI Monitor Cable - HDMI to HDMI Cable',
    //         mfg: 'HDMM6', // Key now exactly matches 'mfg'
    //         cdw: '3036583', // Key now exactly matches 'cdw'
    //         unspsc: '26121600',
    //         imageUrl: 'http://googleusercontent.com/file_content/1',
    //         originalPrice: '13.99', // Key now exactly matches 'originalPrice'
    //         price: '13.29', // Key now exactly matches 'price'
    //         priceLabel: 'My CDW Price', // Key now exactly matches 'priceLabel'
    //         reviews: {
    //             stars: 4.5,
    //             count: 14
    //         },
    //         availability: '1028 units In Stock',
    //         availabilityText: 'Ships today if ordered within 5 hrs 4 mins',
    //         additionalActions: [
    //             { label: 'Add to Compare', type: 'checkbox' },
    //             { label: 'Save to Favorites', type: 'checkbox' }
    //         ],
    //         specs: [],
    //         quantity: 1, // Keep quantity for cart functionality
    //     },
    //     {
    //         id: '2',
    //         name: 'StarTech.com 6ft HDMI Cable - 4K High Speed HDMI Cable w/ Ethernet - HDMI 1.4 - HDMI Monitor Cable - HDMI to HDMI Cable',
    //         mfg: 'HDMM6', // Key now exactly matches 'mfg'
    //         cdw: '3036583', // Key now exactly matches 'cdw'
    //         unspsc: '26121600',
    //         imageUrl: 'http://googleusercontent.com/file_content/1',
    //         originalPrice: '13.99', // Key now exactly matches 'originalPrice'
    //         price: '13.29', // Key now exactly matches 'price'
    //         priceLabel: 'My CDW Price', // Key now exactly matches 'priceLabel'
    //         reviews: {
    //             stars: 4.5,
    //             count: 14
    //         },
    //         availability: '1028 units In Stock',
    //         availabilityText: 'Ships today if ordered within 5 hrs 4 mins',
    //         additionalActions: [
    //             { label: 'Add to Compare', type: 'checkbox' },
    //             { label: 'Save to Favorites', type: 'checkbox' }
    //         ],
    //         specs: [],
    //         quantity: 1, // Keep quantity for cart functionality
    //     },
    //     {
    //         id: '1',
    //         name: 'StarTech.com 6ft HDMI Cable - 4K High Speed HDMI Cable w/ Ethernet - HDMI 1.4 - HDMI Monitor Cable - HDMI to HDMI Cable',
    //         mfg: 'HDMM6', // Key now exactly matches 'mfg'
    //         cdw: '3036583', // Key now exactly matches 'cdw'
    //         unspsc: '26121600',
    //         imageUrl: 'http://googleusercontent.com/file_content/1',
    //         originalPrice: '13.99', // Key now exactly matches 'originalPrice'
    //         price: '13.29', // Key now exactly matches 'price'
    //         priceLabel: 'My CDW Price', // Key now exactly matches 'priceLabel'
    //         reviews: {
    //             stars: 4.5,
    //             count: 14
    //         },
    //         availability: '1028 units In Stock',
    //         availabilityText: 'Ships today if ordered within 5 hrs 4 mins',
    //         additionalActions: [
    //             { label: 'Add to Compare', type: 'checkbox' },
    //             { label: 'Save to Favorites', type: 'checkbox' }
    //         ],
    //         specs: [],
    //         quantity: 1, // Keep quantity for cart functionality
    //     },
    // ];

    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const PRODUCT_SERVER_URL = window.REACT_APP_API_GATEWAY_URL
    useEffect(() => {
        axios
            .get(`${PRODUCT_SERVER_URL}/cart/1234`)
            .then((response) => {
                // Map API response to flat cartItems array for rendering
                const items = response.data.products.map(item => ({
                    ...item.product,
                    quantity: item.quantity
                }));
                setCartItems(items);
            })
            .catch((error) => {
                console.error('Error fetching cart:', error);
            });
    }, []);

    const handleQuantityChange = (cdw, newQuantity) => {
        if (newQuantity < 1) return;
        // Update quantity in backend using POST (body)
        axios
            .post(`${PRODUCT_SERVER_URL}/cart/1234`, {
                cdw: cdw,
                quantity: newQuantity
            })
            .then((response) => {
                // Update local state with new cart from backend
                const items = response.data.products.map(item => ({
                    ...item.product,
                    quantity: item.quantity
                }));
                setCartItems(items);
            })
            .catch((error) => {
                console.error('Error updating quantity:', error);
            });
    };

    const handleRemoveItem = (id) => {
        // Optionally implement backend removal here
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    };

    const nagivateToCheckout = () => {
        navigate('/checkout'); // Assuming you have a checkout route set up
    }

    return (
        <div className="cart-page-container">

            <div className="cart-header-section">
                <h1 className="cart-main-title">Shopping Cart</h1>
                <button className="cart-empty-button">Empty Cart</button>
            </div>

            <div className="cart-content-layout">
                <div className="cart-items-list">
                    {cartItems.length === 0 ? (
                        <p className="cart-empty-message">Your cart is empty.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item-card">
                                <div className="cart-item-image-wrapper">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="cart-item-image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/E0E0E0/333333?text=Error'; }}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <p className="cart-item-codes">
                                        MFG#: {item.mfg} | CDW#: {item.cdw}
                                    </p>
                                    <p className="cart-item-availability">
                                        <span className="cart-availability-dot"></span> {item.availability}
                                    </p>
                                    <p className="cart-item-availability-text">{item.availabilityText}</p>
                                </div>
                                <div className="cart-item-price-quantity">
                                    <p className="cart-item-current-price">${parseFloat(item.price).toFixed(2)}</p>
                                    <div className="cart-quantity-selector">
                                        <button onClick={() => handleQuantityChange(item.cdw, item.quantity - 1)}>-</button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.cdw, parseInt(e.target.value))}
                                            min="1"
                                        />
                                        <button onClick={() => handleQuantityChange(item.cdw, item.quantity + 1)}>+</button>
                                    </div>
                                    <p className="cart-item-total">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                    <button
                                        className="cart-remove-button"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-order-summary">
                    <h2 className="cart-summary-title">Order Summary</h2>
                    <div className="cart-summary-row">
                        <span>Subtotal:</span>
                        <span className="cart-summary-value">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <p className="cart-summary-tax-info">Tax and shipping calculated at checkout.</p>
                    <button className="cart-checkout-button" onClick={nagivateToCheckout}>Check Out</button>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;