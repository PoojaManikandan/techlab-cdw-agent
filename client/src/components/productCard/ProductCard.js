import React from 'react';
import ProductDetails from '../productDetails/ProductDetails';
import ProductActions from '../productActions/ProductAction';
import ProductImage from '../productImage/ProductImage';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const handleAddToCart = (quantity) => {
        // This function is now passed down to ProductActions
        console.log(`Added ${quantity} of product ${product.name} to cart.`);
        navigate('/cart'); // Navigate to the cart page after adding
        
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