import React, { useState } from 'react';
import Button from '../button/Button';

function ProductActions({ availability, availabilityText, price, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity(''); // Allow empty for typing
        }
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => (prevQuantity === '' ? 1 : prevQuantity + 1));
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    return (
        <div className="product-action-section">
            <p className="availability">• {availability}</p>
            <p className="availability-text">{availabilityText}</p>
            <div className='price-section'>
                <p className="price">${price}</p>
                <div className="quantity-add-section">
                    <div className="quantity-selector">
                        <button onClick={handleDecrement}>-</button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                        />
                        <button onClick={handleIncrement}>+</button>
                    </div>
                </div>

            </div>
            <p className="advertised-price">Advertised Price</p>
                {/* Using the new Button component here */}
                <Button onClick={() => onAddToCart(quantity)} className={'add-to-cart-button'}>
                    Add To Cart
                </Button>
        </div>
    );
}

export default ProductActions;