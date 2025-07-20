import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductDetails({ id, name, mfg, cdw, specs }) {
    const navigate = useNavigate();
    return (
        <div className="product-details-section">
            <h2 className="product-name" onClick={() => navigate(`/details/${cdw}`)}>{name}</h2>
            <p className="product-codes">MFG#: {mfg} | CDW#: {cdw}</p>
            <div className="product-specs">
                {specs.map((spec, index) => (
                    <div key={index} className="spec-row">
                        <span className="spec-label">{spec.label}:</span>
                        <span className="spec-value">{spec.value}</span>
                    </div>
                ))}
                {/* Only show expand specs if there are more specs than shown or if it's a general placeholder */}
                {specs.length < 5 && ( /* Adjusted condition based on provided mock data */
                    <span className="expand-specs">[+] Expand Specs</span>
                )}
            </div>
        </div>
    );
}

export default ProductDetails;