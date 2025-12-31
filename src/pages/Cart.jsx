import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import './Customer.css';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

    const handleCheckout = () => {
        alert('주문 기능은 준비중입니다! (관리자 페이지에서 확인 가능하도록 연동 필요)');
    };

    return (
        <div>
            <Navbar />
            <div className="cart-page-container">
                <h1 className="section-title">장바구니</h1>

                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <p>장바구니가 비어있습니다.</p>
                        <Link to="/" className="hero-btn" style={{ marginTop: '1rem', backgroundColor: '#2c3e50', color: 'white' }}>
                            쇼핑하러 가기
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.price)}</p>

                                        <div className="cart-controls">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >-</button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >+</button>

                                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>상품 금액</span>
                                <span>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalPrice)}</span>
                            </div>
                            <div className="summary-row">
                                <span>배송비</span>
                                <span>무료</span>
                            </div>
                            <div className="summary-row summary-total">
                                <span>총 결제금액</span>
                                <span>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(totalPrice)}</span>
                            </div>

                            <button className="checkout-btn" onClick={handleCheckout}>
                                주문하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
