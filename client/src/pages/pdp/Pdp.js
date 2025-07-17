import React, { useState } from 'react';
import products from '../../data/product'; // Import mock product data
import './Pdp.css'; // Import the CSS file
import ProductCard from '../../components/productCard/ProductCard';

function PDP() {
    return (
        <div className="pdp-container">
            <h1 className="section-title">Hardware</h1>
            <p className="section-description">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </p>

            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}


export default PDP;