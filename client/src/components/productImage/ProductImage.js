import React from 'react';

function ProductImage({ imageUrl, altText }) {
    return (
        <div className="product-image-section">
            <img
                src={imageUrl}
                alt={altText}
                className="product-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E0E0E0/333333?text=Image+Error'; }}
            />
        </div>
    );
}

export default ProductImage;