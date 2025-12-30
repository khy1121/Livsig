import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, fetchAdminStats, fetchOrders, fetchProducts } from '../utils/auth';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [statsData, ordersData, productsData] = await Promise.all([
            fetchAdminStats(),
            fetchOrders(),
            fetchProducts()
        ]);

        setStats(statsData);
        setOrders(ordersData);
        setProducts(productsData);
        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading">데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-left">
                    <h1>SIGNAL LIVING</h1>
                    <span className="header-subtitle">관리자 페이지</span>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    로그아웃
                </button>
            </header>

            <div className="admin-content">
                <aside className="admin-sidebar">
                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            📊 대시보드
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            📦 주문 관리
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            🛍️ 상품 관리
                        </button>
                    </nav>
                </aside>

                <main className="admin-main">
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-view">
                            <h2>대시보드</h2>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📦</div>
                                    <div className="stat-content">
                                        <div className="stat-label">총 주문</div>
                                        <div className="stat-value">{stats?.totalOrders || 0}개</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">🛍️</div>
                                    <div className="stat-content">
                                        <div className="stat-label">총 상품</div>
                                        <div className="stat-value">{stats?.totalProducts || 0}개</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-content">
                                        <div className="stat-label">총 매출</div>
                                        <div className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</div>
                                    </div>
                                </div>

                                <div className="stat-card highlight">
                                    <div className="stat-icon">🆕</div>
                                    <div className="stat-content">
                                        <div className="stat-label">신규 주문</div>
                                        <div className="stat-value">{stats?.newOrders || 0}개</div>
                                    </div>
                                </div>
                            </div>

                            <div className="recent-section">
                                <h3>최근 주문</h3>
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>주문번호</th>
                                                <th>고객명</th>
                                                <th>금액</th>
                                                <th>상태</th>
                                                <th>날짜</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 5).map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.orderNumber}</td>
                                                    <td>{order.customer}</td>
                                                    <td>{formatCurrency(order.amount)}</td>
                                                    <td>
                                                        <span className={`status-badge status-${order.status}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>{order.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="orders-view">
                            <h2>주문 관리</h2>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>주문번호</th>
                                            <th>고객명</th>
                                            <th>금액</th>
                                            <th>상태</th>
                                            <th>날짜</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.orderNumber}</td>
                                                <td>{order.customer}</td>
                                                <td>{formatCurrency(order.amount)}</td>
                                                <td>
                                                    <span className={`status-badge status-${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{order.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="products-view">
                            <h2>상품 관리</h2>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>상품명</th>
                                            <th>카테고리</th>
                                            <th>가격</th>
                                            <th>재고</th>
                                            <th>상태</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.category}</td>
                                                <td>{formatCurrency(product.price)}</td>
                                                <td>{product.stock}개</td>
                                                <td>
                                                    <span className={`status-badge status-${product.status}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
