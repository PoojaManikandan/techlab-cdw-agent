import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import products from '../../data/product';
import './Pdp.css';
import ProductCard from '../../components/productCard/ProductCard';


function PDP() {
    const [products, setProducts] = useState([]);
    // const PRODUCT_SERVER_URL = window.REACT_APP_API_GATEWAY_URL
    useEffect(() => {
        axios
            .get(`${window.REACT_APP_API_GATEWAY_URL}/products`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setProducts([]);
            });
    }, []);

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