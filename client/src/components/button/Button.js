import React from 'react';

function Button({ onClick, children, className }) {
    return (
        <button
            onClick={onClick}
            className={`add-to-cart-button ${className || ''}`} // Apply base class and any additional classes
        >
            {children}
        </button>
    );
}

export default Button;