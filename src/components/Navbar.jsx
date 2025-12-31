import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="public-navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    SIGNAL LIVING
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/products" className="nav-link">Shop</Link>

                    <Link to="/cart" className="cart-link">
                        <span className="cart-icon">🛒</span>
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>

                    <Link to="/admin/login" className="login-link">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
