import React from 'react';
import axios from 'axios';
import ProductDetails from '../productDetails/ProductDetails';
import ProductActions from '../productActions/ProductAction';
import ProductImage from '../productImage/ProductImage';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const PRODUCT_SERVER_URL = window.REACT_APP_API_GATEWAY_URL
    const handleAddToCart = async (quantity) => {
        try {
            await axios.post(`${PRODUCT_SERVER_URL}/cart/1234`, {
                cdw: product.cdw,
                quantity: quantity
            });
            navigate('/cart'); // Navigate to the cart page after adding
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="product-card">
            <ProductImage imageUrl={product.imageUrl} altText={product.name} wrapperClass={'product-image-section'} className={'product-image'} />
            <ProductDetails
                id={product.id}
                name={product.name}
                mfg={product.mfg}
                cdw={product.cdw}
                specs={product.specs}
            />
            <ProductActions
                availability={product.availability}
                availabilityText={product.availabilityText}
                price={product.price}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}

export default ProductCard;