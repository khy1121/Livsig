import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigating to detail page if clicked on button
        addToCart(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image-container">
                <img
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="product-image"
                />
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}
                </p>
                <button className="add-cart-btn" onClick={handleAddToCart}>
                    담기
                </button>
            </div>
        </Link>
    );
}
