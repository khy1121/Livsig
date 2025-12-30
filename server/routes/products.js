import express from 'express';
import Product from '../models/Product.model.js';

const router = express.Router();

// 전체 상품 목록 조회 (필터링 포함)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { status: '판매중' }; // 기본적으로 판매중인 상품만

        // category가 있고 'all'이 아니면 필터 추가
        if (category && category !== 'all') {
            query.category = category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        const formattedProducts = products.map(p => ({
            id: p._id,
            ...p.toObject()
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Products fetch error:', error);
        res.status(500).json({ message: '상품 목록을 불러오는데 실패했습니다.' });
    }
});

// 단일 상품 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
        }

        res.json({
            id: product._id,
            ...product.toObject()
        });
    } catch (error) {
        res.status(500).json({ message: '상품 조회 실패' });
    }
});

// 카테고리별 상품 조회
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({
            category,
            status: '판매중'
        }).sort({ createdAt: -1 });

        const formattedProducts = products.map(p => ({
            id: p._id,
            ...p.toObject()
        }));

        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: '카테고리 상품 조회 실패' });
    }
});

export default router;
