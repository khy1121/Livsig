import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            // Fetch product details
            const response = await fetch(`http://localhost:3001/api/products/${id}`);
            const data = await response.json();
            setProduct(data);

            // Fetch related products from same category
            if (data.category) {
                const relatedResponse = await fetch(`http://localhost:3001/api/products?category=${data.category}`);
                const relatedData = await relatedResponse.json();
                // Filter out current product and limit to 4
                const filtered = relatedData.filter(p => p.id !== id).slice(0, 4);
                setRelatedProducts(filtered);
            }
        } catch (error) {
            console.error('Failed to load product', error);
            toast.error('상품을 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    if (loading) {
        return <div className="loading-container">로딩 중...</div>;
    }

    if (!product) {
        return <div className="error-container">상품을 찾을 수 없습니다</div>;
    }

    const imageUrl = product.imageUrl
        ? `http://localhost:3001${product.imageUrl}`
        : '/images/placeholder.jpg';

    return (
        <div className="product-detail-page">
            {/* Header */}
            <header className="detail-header">
                <div className="container">
                    <button onClick={handleBackClick} className="back-button">
                        ← 뒤로 가기
                    </button>
                    <h1 className="logo">SIGNAL LIVING</h1>
                    <div></div>
                </div>
            </header>

            {/* Product Detail Section */}
            <section className="product-detail-container">
                <div className="container">
                    <div className="detail-grid">
                        <div className="detail-image-section">
                            <img src={imageUrl} alt={product.name} className="detail-image" />
                        </div>

                        <div className="detail-info-section">
                            <p className="detail-category">{product.category}</p>
                            <h1 className="detail-name">{product.name}</h1>
                            <p className="detail-price">
                                {new Intl.NumberFormat('ko-KR').format(product.price)}원
                            </p>

                            <div className="detail-description">
                                <h3>상품 설명</h3>
                                <p>{product.description || '상품에 대한 설명이 없습니다.'}</p>
                            </div>

                            <div className="detail-info-list">
                                <div className="info-item">
                                    <span className="info-label">재고</span>
                                    <span className="info-value">{product.stock}개</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">상태</span>
                                    <span className={`info-value status-${product.status}`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>

                            <button className="btn-contact">
                                문의하기
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="related-products-section">
                    <div className="container">
                        <h2 className="section-title">관련 상품</h2>
                        <div className="related-products-grid">
                            {relatedProducts.map((relProd, index) => (
                                <article
                                    key={relProd.id}
                                    className="related-product-card"
                                    onClick={() => handleProductClick(relProd.id)}
                                >
                                    <div className="related-product-image">
                                        <img
                                            src={relProd.imageUrl ? `http://localhost:3001${relProd.imageUrl}` : '/images/placeholder.jpg'}
                                            alt={relProd.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="related-product-info">
                                        <h3 className="related-product-name">{relProd.name}</h3>
                                        <p className="related-product-price">
                                            {new Intl.NumberFormat('ko-KR').format(relProd.price)}원
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="detail-footer">
                <div className="container">
                    <p className="copyright">© 2024 SIGNAL LIVING. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
