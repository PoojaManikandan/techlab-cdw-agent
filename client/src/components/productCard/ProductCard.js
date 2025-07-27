import ProductDetails from '../productDetails/ProductDetails';
import ProductActions from '../productActions/ProductAction';
import ProductImage from '../productImage/ProductImage';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/api';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const PRODUCT_SERVER_URL = window.REACT_APP_API_GATEWAY_URL;
    const userId = localStorage.getItem("userId");
    const handleAddToCart = async (quantity) => {

        if (userId === null || userId === undefined )
        {
             navigate('/login')
        } else{
            try {
                await apiClient.post(`${PRODUCT_SERVER_URL}/cart/${userId}`, {
                    cdw: product.cdw,
                    quantity: quantity
                });
                navigate('/cart');
                // Navigate to the cart page after adding
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
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