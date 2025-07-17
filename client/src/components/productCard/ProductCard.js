import React from 'react';
import ProductDetails from '../productDetails/ProductDetails';
import ProductActions from '../productActions/ProductAction';
import ProductImage from '../productImage/ProductImage';

function ProductCard({ product }) {
    const handleAddToCart = (quantity) => {
        // This function is now passed down to ProductActions
        console.log(`Added ${quantity} of product ${product.name} to cart.`);
        alert(`Added ${quantity} of "${product.name}" to cart!`);
    };

    return (
        <div className="product-card">
            <ProductImage imageUrl={product.imageUrl} altText={product.name} />
            <ProductDetails
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