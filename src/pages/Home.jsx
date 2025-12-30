import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');

            if (!response.ok) {
                console.error('API Error:', response.status);
                setProducts([]);
                return;
            }

            const data = await response.json();
            console.log('Loaded products:', data);
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('상품 로딩 실패:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price) + '원';
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'pajamas': 'PAJAMAS',
            'slippers': 'SLIPPERS',
            'aprons': 'APRONS',
            'bedding': 'BEDDING',
            'accessories': 'ACCESSORIES'
        };
        return labels[category] || category.toUpperCase();
    };

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <>
            {/* Header */}
            <header className="header" id="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <h1>SIGNAL26</h1>
                        </div>

                        <nav className="nav" id="mainNav">
                            <ul className="nav-list">
                                <li><a href="#" className="nav-link">New</a></li>
                                <li><a href="#" className="nav-link active">Best</a></li>
                                <li><a href="#" className="nav-link">Sale</a></li>
                                <li><a href="#" className="nav-link">Collection</a></li>
                            </ul>
                        </nav>

                        <div className="header-actions">
                            <div className="search-box">
                                <input type="search" placeholder="Search" />
                            </div>
                            <Link to="/admin/login" className="icon-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </Link>
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
                    <h2 className="hero-title">럭셔리 리빙 액세서리 쇼핑몰</h2>
                    <p className="hero-subtitle">시그널에서 홈 스타일링을 시작하세요</p>
                    <a href="#products" className="btn-primary">컬렉션 보기</a>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="filter-bar">
                <div className="container">
                    <div className="filter-content">
                        <div className="filter-categories">
                            <button
                                className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-chip ${filter === 'pajamas' ? 'active' : ''}`}
                                onClick={() => setFilter('pajamas')}
                            >
                                Pajamas
                            </button>
                            <button
                                className={`filter-chip ${filter === 'slippers' ? 'active' : ''}`}
                                onClick={() => setFilter('slippers')}
                            >
                                Slippers
                            </button>
                            <button
                                className={`filter-chip ${filter === 'aprons' ? 'active' : ''}`}
                                onClick={() => setFilter('aprons')}
                            >
                                Aprons
                            </button>
                            <button
                                className={`filter-chip ${filter === 'bedding' ? 'active' : ''}`}
                                onClick={() => setFilter('bedding')}
                            >
                                Bedding
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products" id="products">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">신상품</h2>
                        <p className="section-subtitle">New Arrivals</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '16px', color: '#666' }}>
                            상품을 불러오는 중...
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '16px', color: '#666' }}>
                            <p>등록된 상품이 없습니다.</p>
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>
                                <Link to="/admin/login" style={{ color: '#A8B5A0', textDecoration: 'underline' }}>
                                    관리자 페이지
                                </Link>에서 상품을 추가해주세요.
                            </p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <article key={product.id} className="product-card">
                                    <div className="product-image">
                                        {product.imageUrl ? (
                                            <img
                                                src={`http://localhost:3001${product.imageUrl}`}
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                src={`https://via.placeholder.com/400x500/F5F1ED/A8B5A0?text=${encodeURIComponent(product.name)}`}
                                                alt={product.name}
                                                loading="lazy"
                                            />
                                        )}
                                        {product.isNew && <span className="badge badge-new">NEW</span>}
                                        {product.isBest && <span className="badge badge-best">BEST</span>}
                                        {product.discount > 0 && (
                                            <span className="badge badge-discount">{product.discount}%</span>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="sold-out-overlay">품절</div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <div className="product-category-label">{getCategoryLabel(product.category)}</div>
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-desc">{product.description}</p>
                                        <div className="product-price">
                                            <span className="price-current">{formatPrice(product.price)}</span>
                                            {product.discount > 0 && (
                                                <span className="price-original">
                                                    {formatPrice(Math.round(product.price / (1 - product.discount / 100)))}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
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
                                <li><Link to="/admin/login">관리자 로그인</Link></li>
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
        </>
    );
}
