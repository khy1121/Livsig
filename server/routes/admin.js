import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 모든 admin 라우트에 인증 미들웨어 적용
router.use(requireAuth);

// 대시보드 통계
router.get('/stats', (req, res) => {
    // 실제 데이터베이스 대신 목업 데이터
    res.json({
        totalOrders: 42,
        totalProducts: 8,
        totalRevenue: 3250000,
        newOrders: 5
    });
});

// 주문 목록
router.get('/orders', (req, res) => {
    // 목업 주문 데이터
    const orders = [
        {
            id: 1,
            orderNumber: 'ORD-2024-001',
            customer: '김민수',
            amount: 89000,
            status: '배송중',
            date: '2024-12-30'
        },
        {
            id: 2,
            orderNumber: 'ORD-2024-002',
            customer: '이지은',
            amount: 125000,
            status: '배송완료',
            date: '2024-12-29'
        },
        {
            id: 3,
            orderNumber: 'ORD-2024-003',
            customer: '박서준',
            amount: 67000,
            status: '주문확인',
            date: '2024-12-30'
        }
    ];

    res.json(orders);
});

// 상품 목록
router.get('/products', (req, res) => {
    // 목업 상품 데이터
    const products = [
        {
            id: 1,
            name: '프리미엄 파자마 세트',
            category: 'pajamas',
            price: 89000,
            stock: 15,
            status: '판매중'
        },
        {
            id: 2,
            name: '호텔식 슬리퍼',
            category: 'slippers',
            price: 35000,
            stock: 0,
            status: '품절'
        },
        {
            id: 3,
            name: '린넨 앞치마',
            category: 'aprons',
            price: 45000,
            stock: 23,
            status: '판매중'
        }
    ];

    res.json(products);
});

// 상품 추가
router.post('/products', (req, res) => {
    const { name, category, price, stock } = req.body;

    // 실제로는 데이터베이스에 저장
    const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        stock,
        status: '판매중'
    };

    res.json({
        success: true,
        product: newProduct,
        message: '상품이 추가되었습니다'
    });
});

// 상품 수정
router.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, price, stock, status } = req.body;

    // 실제로는 데이터베이스에서 업데이트
    res.json({
        success: true,
        message: '상품이 수정되었습니다'
    });
});

// 상품 삭제
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    // 실제로는 데이터베이스에서 삭제
    res.json({
        success: true,
        message: '상품이 삭제되었습니다'
    });
});

export default router;
