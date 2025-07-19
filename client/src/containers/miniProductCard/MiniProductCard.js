import React, { useState } from 'react';
import './MiniProductCard.css'; // Dedicated CSS for this component

function MiniProductCard({ products }) {
    // Default product structure for demonstration if props are not fully provided
    const defaultProduct = {
        name: 'StarTech.com 6ft HDMI Cable - 4K High Speed HDMI Cable w/ Ethernet - HDMI 1.4 - HDMI Monitor Cable - HDMI to HDMI Cable',
        mfgPart: 'HDMM6',
        cdwPart: '3036583',
        unspsc: '26121600',
        imageUrl: 'http://googleusercontent.com/file_content/2', // Image from screenshot
        originalPrice: 13.99,
        price: 13.29,
        availability: '1028 units In Stock',
        shippingInfo: 'Ships today if ordered within 5 hrs 4 mins',
        reviews: 14,
    };

    const item = products || defaultProduct;
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        alert(`Added ${quantity} of "${item.name}" to cart.`);
        // In a real app, this would dispatch an action to add to cart
    };

    console.log('products', products)

    return (
        <div className='mini-product-card-container'>
        {products.map((product, idx) => (
        <div className="product-listing-card-container" key={idx}>
            <div style={{display:'flex', gap:'8px'}}>

                <img src={product.imageUrl} alt={product.name} className="product-listing-card-image"
                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E0E0E0/333333?text=Product'; }}/>
            <div className="product-listing-card-details-section">
                <h3 className="product-listing-card-name">{product.name}</h3>
            </div>
            </div>
                <p className="product-listing-card-part-numbers">
                    MFG Part: {product.mfgPart} | CDW#: {product.cdwPart} {product.unspsc && `| UNSPSC ${product.unspsc}`}
                </p>
            <div className="product-listing-card-price-add-section">
                <p className="product-listing-card-current-price">${product.price}</p>
                <div className="product-listing-card-qty-add">
                    <button className="product-listing-card-add-to-cart-button" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
        ))}
        </div>
    );
}

export default MiniProductCard;