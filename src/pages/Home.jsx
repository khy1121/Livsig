import { useState, useEffect } from 'react';
import { fetchProducts } from '../utils/auth';
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Failed to load products', error);
        }
    };

    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        if (category === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === category));
        }
    };

    return (
        <div className="home-page">
            {/* Header */}
            <header className="header" id="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <h1>SIGNAL LIVING</h1>
                        </div>

                        <nav className="nav" id="mainNav">
                            <ul className="nav-list">
                                <li><a href="#" onClick={() => handleCategoryFilter('all')} className={activeCategory === 'all' ? 'nav-link active' : 'nav-link'}>All</a></li>
                                <li><a href="#" onClick={() => handleCategoryFilter('파자마')} className={activeCategory === '파자마' ? 'nav-link active' : 'nav-link'}>파자마</a></li>
                                <li><a href="#" onClick={() => handleCategoryFilter('슬리퍼')} className={activeCategory === '슬리퍼' ? 'nav-link active' : 'nav-link'}>슬리퍼</a></li>
                                <li><a href="#" onClick={() => handleCategoryFilter('앞치마')} className={activeCategory === '앞치마' ? 'nav-link active' : 'nav-link'}>앞치마</a></li>
                            </ul>
                        </nav>

                        <div className="header-actions">
                            <div className="search-box">
                                <input type="search" placeholder="Search" aria-label="Search products" />
                                <button type="submit" aria-label="Search">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </button>
                            </div>
                            <button className="icon-btn" aria-label="User account">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                            <a href="/admin/login" className="icon-btn" aria-label="Admin">👤</a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-image">
                    <img src="/hero_banner.png" alt="Luxury Living Lifestyle" />
                </div>
                <div className="hero-content">
                    <h2 className="hero-title">모던 라이프스타일</h2>
                    <p className="hero-subtitle">시그널에서 홈 스타일링을 시작하세요</p>
                    <a href="#products" className="btn-primary">컬렉션 보기</a>
                </div>
            </section>

            {/* Products Section */}
            <section className="products" id="products">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">신상품</h2>
                        <p className="section-subtitle">New Arrivals</p>
                    </div>

                    <div className="product-grid" id="productGrid">
                        {filteredProducts.map((product, index) => {
                            const imageUrl = product.imageUrl
                                ? `http://localhost:3001${product.imageUrl}`
                                : `/images/KakaoTalk_20251231_131924311_${String(index % 20).padStart(2, '0')}.jpg`;

                            return (
                                <article
                                    key={product.id || product._id}
                                    className="product-card"
                                    onClick={() => window.location.href = `/product/${product.id || product._id}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="product-image">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            loading="lazy"
                                        />
                                        {product.status === '판매중' && <span className="badge badge-new">NEW</span>}
                                    </div>
                                    <div className="product-info">
                                        <div className="product-category-label">{product.category.toUpperCase()}</div>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-desc">{product.description || 'Premium Quality Product'}</p>
                                        <div className="product-price">
                                            <span className="price-current">
                                                {new Intl.NumberFormat('ko-KR').format(product.price)}원
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3 className="footer-logo">SIGNAL LIVING</h3>
                            <p className="footer-desc">럭셔리 리빙 액세서리 쇼핑몰<br />감성적인 홈 스타일링을 제안합니다</p>
                        </div>

                        <div className="footer-section">
                            <h4>고객센터</h4>
                            <ul className="footer-links">
                                <li><a href="#">공지사항</a></li>
                                <li><a href="#">자주 묻는 질문</a></li>
                                <li><a href="#">1:1 문의</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>쇼핑 정보</h4>
                            <ul className="footer-links">
                                <li><a href="#">배송 안내</a></li>
                                <li><a href="#">교환 및 반품</a></li>
                                <li><a href="#">이용약관</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="copyright">© 2024 SIGNAL LIVING. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
