import React from 'react';

function ProductImage({ className, wrapperClass, imageUrl, altText }) {
    return (
        <div className={wrapperClass}>
            <img
                src={imageUrl}
                alt={altText}
                className={className}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E0E0E0/333333?text=Image+Error'; }}
            />
        </div>
    );
}

export default ProductImage;