import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { logout, fetchAdminStats, fetchOrders, fetchProducts, deleteProduct } from '../utils/auth';
import ProductModal from '../components/ProductModal';
import OrderDetailModal from '../components/OrderDetailModal';
import ActivityLogs from '../components/ActivityLogs';
import UserManagement from './UserManagement'; // Reuse existing page component as sub-component
import './AdminDashboard.css';

const COLORS = ['#A8B5A0', '#D4B5B0', '#8FA087', '#C9A896', '#7F9B8E'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    // 매출 데이터 (최근 7일)
    const [revenueData] = useState([
        { date: '12/24', revenue: 450000, orders: 8 },
        { date: '12/25', revenue: 520000, orders: 12 },
        { date: '12/26', revenue: 380000, orders: 6 },
        { date: '12/27', revenue: 620000, orders: 15 },
        { date: '12/28', revenue: 550000, orders: 11 },
        { date: '12/29', revenue: 480000, orders: 9 },
        { date: '12/30', revenue: 680000, orders: 14 }
    ]);

    // 카테고리별 판매 데이터
    const [categoryData] = useState([
        { name: '파자마', value: 35, sales: 1200000 },
        { name: '슬리퍼', value: 25, sales: 850000 },
        { name: '앞치마', value: 20, sales: 680000 },
        { name: '침구', value: 20, sales: 720000 }
    ]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const loadingToast = toast.loading('데이터를 불러오는 중...');

        try {
            const [statsData, ordersData, productsData] = await Promise.all([
                fetchAdminStats(),
                fetchOrders(),
                fetchProducts()
            ]);

            setStats(statsData);
            setOrders(ordersData);
            setProducts(productsData);

            toast.success('데이터를 성공적으로 불러왔습니다', {
                id: loadingToast,
            });
        } catch (error) {
            toast.error('데이터 로딩 실패', {
                id: loadingToast,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('로그아웃되었습니다');
        navigate('/admin/login');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    const handleProductEdit = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleProductAdd = () => {
        setSelectedProduct(null);
        setShowProductModal(true);
    };

    const handleProductDelete = async (productId) => {
        if (window.confirm('정말 이 상품을 삭제하시겠습니까?')) {
            const result = await deleteProduct(productId);
            if (result.success) {
                toast.success('상품이 삭제되었습니다');
                await loadData();
            } else {
                toast.error('상품 삭제에 실패했습니다');
            }
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    // Excel 다운로드 기능
    const exportToExcel = () => {
        try {
            // 데이터 준비
            const excelData = filteredOrders.map(order => ({
                '주문번호': order.orderNumber,
                '고객명': order.customer,
                '금액': order.amount,
                '상태': order.status,
                '날짜': order.date
            }));

            // 워크시트 생성
            const ws = XLSX.utils.json_to_sheet(excelData);

            // 워크북 생성
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '주문내역');

            // 파일 다운로드
            const fileName = `주문내역_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            toast.success('Excel 파일이 다운로드되었습니다');
        } catch (error) {
            toast.error('Excel 다운로드 실패');
            console.error('Excel export error:', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading">데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: '#A8B5A0',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: '#A8B5A0',
                        },
                    },
                    error: {
                        style: {
                            background: '#E74C3C',
                            color: 'white',
                        },
                    },
                    loading: {
                        style: {
                            background: '#3498DB',
                            color: 'white',
                        },
                    },
                }}
            />

            <header className="admin-header">
                <div className="header-left">
                    <h1>SIGNAL LIVING</h1>
                    <span className="header-subtitle">관리자 페이지</span>
                </div>
                <div className="header-actions">
                    <button onClick={() => navigate('/')} className="home-button">
                        🏠 홈으로
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        로그아웃
                    </button>
                </div>
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
                        <button
                            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            👥 사용자 관리
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('logs')}
                        >
                            📋 활동 로그
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

                            {/* 매출 그래프 */}
                            <div className="chart-section">
                                <h3>최근 7일 매출 추이</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value, name) => {
                                                    if (name === 'revenue') return [formatCurrency(value), '매출'];
                                                    return [value + '개', '주문'];
                                                }}
                                            />
                                            <Legend
                                                formatter={(value) => value === 'revenue' ? '매출' : '주문 수'}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="#A8B5A0" strokeWidth={2} />
                                            <Line type="monotone" dataKey="orders" stroke="#D4B5B0" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 카테고리별 판매 */}
                            <div className="charts-row">
                                <div className="chart-section half">
                                    <h3>카테고리별 판매 비율</h3>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `${value}%`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="chart-section half">
                                    <h3>카테고리별 매출</h3>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={categoryData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                                <Bar dataKey="sales" fill="#A8B5A0" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* 최근 주문 */}
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
                                                <tr key={order.id} onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
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
                            <div className="view-header">
                                <h2>주문 관리</h2>
                                <div className="filters">
                                    <input
                                        type="text"
                                        placeholder="주문번호 또는 고객명 검색..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">전체 상태</option>
                                        <option value="주문확인">주문확인</option>
                                        <option value="배송중">배송중</option>
                                        <option value="배송완료">배송완료</option>
                                    </select>
                                    <button className="add-btn" onClick={exportToExcel}>
                                        📥 Excel 다운로드
                                    </button>
                                </div>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>주문번호</th>
                                            <th>고객명</th>
                                            <th>금액</th>
                                            <th>상태</th>
                                            <th>날짜</th>
                                            <th>작업</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map(order => (
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
                                                <td>
                                                    <button
                                                        className="action-btn"
                                                        onClick={() => handleOrderClick(order)}
                                                    >
                                                        상세보기
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="products-view">
                            <div className="view-header">
                                <h2>상품 관리</h2>
                                <button className="add-btn" onClick={handleProductAdd}>
                                    + 상품 추가
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>상품명</th>
                                            <th>카테고리</th>
                                            <th>가격</th>
                                            <th>재고</th>
                                            <th>상태</th>
                                            <th>작업</th>
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
                                                <td>
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => handleProductEdit(product)}
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleProductDelete(product.id)}
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="users-view-integrated">
                            <UserManagement />
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <ActivityLogs />
                    )}
                </main>
            </div>

            {showProductModal && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setShowProductModal(false)}
                    onSave={loadData}
                />
            )}

            {showOrderModal && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setShowOrderModal(false)}
                    onUpdate={loadData}
                />
            )}
        </div>
    );
}
