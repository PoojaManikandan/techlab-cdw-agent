import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

import './ProductDetailsPage.css';
import Button from '../../components/button/Button';
import ProductImage from '../../components/productImage/ProductImage';
import { useNavigate } from 'react-router-dom';

function ProductDetailsPage() { 
    const params= useParams()
    const [product, setProduct] = useState({});
    const PRODUCT_SERVER_URL = window.REACT_APP_API_GATEWAY_URL
    useEffect(() => {
        axios
            .get(`${PRODUCT_SERVER_URL}/products/${params.cdw}`)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                setProduct({});
            });
    }, []);

    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    // If no product is provided, render a message
    if (!product) {
        return (
            <div className="shdmi-pdp-container">
                <p>Product data not available.</p>
            </div>
        );
    }

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => (prevQuantity === '' ? 1 : prevQuantity + 1));
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = () => {
        console.log(`Added ${quantity} of ${product.name} to cart.`);
        navigate('/cart'); // Navigate to the cart page after adding
    };

    // Helper for rendering stars
    const StarRating = ({ stars }) => {
        const fullStars = Math.floor(stars);
        const hasHalfStar = stars % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="shdmi-star-rating">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="shdmi-star shdmi-full">★</span>
                ))}
                {hasHalfStar && <span className="shdmi-star shdmi-half">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="shdmi-star shdmi-empty">☆</span>
                ))}
            </div>
        );
    };

    return (
        <div className="shdmi-pdp-container">
            <div className="shdmi-product-header">
                <h1 className="shdmi-product-name">{product.name}</h1>
                <p className="shdmi-product-codes">
                    MFG# {product.mfg} | CDW# {product.cdw} {product.unspsc && `| UNSPSC ${product.unspsc}`}
                </p>
            </div>

            <div className="shdmi-product-main-content">
                <ProductImage imageUrl={product.imageUrl} altText={product.name} className="shdmi-product-image" wrapperClass="shdmi-product-image" />

                <div className="shdmi-details-section">
                    {product.originalPrice && <p className="shdmi-original-price">${product.originalPrice}</p>}
                    <p className="shdmi-current-price">${product.price}</p>
                    {product.priceLabel && <p className="shdmi-price-label">{product.priceLabel}</p>}

                    {product.reviews && (
                        <div className="shdmi-reviews-section">
                            <span className="shdmi-reviews-text">Reviews</span>
                            <StarRating stars={product.reviews.stars} />
                            <span className="shdmi-reviews-count">({product.reviews.count})</span>
                        </div>
                    )}

                    <div className="shdmi-quantity-availability-group">
                        <div className="shdmi-quantity-selector">
                            <button onClick={handleDecrement}>-</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                            />
                            <button onClick={handleIncrement}>+</button>
                        </div>
                        <div className="shdmi-availability-info">
                            <p className="shdmi-availability">Availability: {product.availability}</p>
                            <p className="shdmi-availability-text">{product.availabilityText}</p>
                        </div>
                    </div>

                    <Button onClick={() => handleAddToCart(quantity)} className={'shdmi-add-to-cart-button'}>
                        Add To Cart
                    </Button>

                    {product.additionalActions && (
                        <div className="shdmi-additional-actions">
                            {product.additionalActions.map((action, index) => (
                                <label key={index} className="shdmi-action-checkbox">
                                    <input type="checkbox" /> {action.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;