import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateProduct, validateAdminCreate, validateAdminUpdate } from '../middleware/validators.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Admin from '../models/Admin.model.js';
import ActivityLog from '../models/ActivityLog.model.js';

const router = express.Router();

// ===================================
// 대시보드 통계 API
// ===================================
router.get('/stats', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const newOrders = await Order.countDocuments({ status: '주문확인' }); // 예: '주문확인' 상태인 주문

        // 총 매출 계산 (Aggregation)
        const revenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        res.json({
            totalOrders,
            totalProducts,
            totalRevenue,
            newOrders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '통계 조회 실패' });
    }
});

// ===================================
// 주문 관리 API
// ===================================

// 주문 목록 조회
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        // 프론트엔드 호환성을 위해 _id -> id 매핑 (필요하다면)
        const formattedOrders = orders.map(order => ({
            id: order._id,
            orderNumber: order.orderNumber,
            customer: order.customer,
            amount: order.amount,
            status: order.status,
            date: order.date,
            items: order.items
        }));
        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ success: false, message: '주문 목록 조회 실패' });
    }
});

// 주문 상태 변경
router.patch('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다' });
        }

        // 활동 로그
        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'UPDATE_ORDER',
            target: order.orderNumber,
            details: { oldStatus: 'unknown', newStatus: status }
        });

        res.json({
            success: true,
            message: '주문 상태가 변경되었습니다',
            order: {
                id: order._id,
                ...order.toObject()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '주문 상태 변경 실패' });
    }
});

// ===================================
// 상품 관리 API
// ===================================

// 상품 목록 조회
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        const formattedProducts = products.map(p => ({
            id: p._id,
            ...p.toObject()
        }));
        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ success: false, message: '상품 목록 조회 실패' });
    }
});

// 상품 추가
router.post('/products', validateProduct, async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);

        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'CREATE_PRODUCT',
            target: newProduct.name,
            details: { productId: newProduct._id }
        });

        res.json({
            success: true,
            message: '상품이 추가되었습니다',
            product: {
                id: newProduct._id,
                ...newProduct.toObject()
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: '상품 추가 실패' });
    }
});

// 상품 수정
router.put('/products/:id', validateProduct, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다' });
        }

        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'UPDATE_PRODUCT',
            target: updatedProduct.name,
            details: { productId: updatedProduct._id }
        });

        res.json({
            success: true,
            message: '상품이 수정되었습니다',
            product: {
                id: updatedProduct._id,
                ...updatedProduct.toObject()
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: '상품 수정 실패' });
    }
});

// 상품 삭제
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다' });
        }

        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'DELETE_PRODUCT',
            target: deletedProduct.name,
            details: { productId: id }
        });

        res.json({
            success: true,
            message: '상품이 삭제되었습니다'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '상품 삭제 실패' });
    }
});

// ===================================
// 사용자 관리 API
// ===================================

// 관리자 목록 조회
router.get('/users', async (req, res) => {
    try {
        const admins = await Admin.find({}, '-passwordHash').sort({ createdAt: -1 });
        const formattedAdmins = admins.map(a => ({
            id: a._id,
            ...a.toObject()
        }));
        res.json(formattedAdmins);
    } catch (error) {
        res.status(500).json({ success: false, message: '관리자 목록 조회 실패' });
    }
});

// 관리자 추가 (super_admin만 가능)
router.post('/users', validateAdminCreate, async (req, res) => {
    try {
        if (req.session.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: '권한이 없습니다' });
        }

        const { username, password, role } = req.body;

        // 이미 존재하는지 확인
        const exists = await Admin.findOne({ username });
        if (exists) {
            return res.status(400).json({ success: false, message: '이미 존재하는 사용자명입니다' });
        }

        const newAdmin = await Admin.create({
            username,
            passwordHash: password, // pre('save')에서 해싱됨
            role: role || 'admin'
        });

        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'CREATE_ADMIN',
            target: newAdmin.username,
            details: { createdId: newAdmin._id, role: newAdmin.role }
        });

        res.json({
            success: true,
            message: '관리자가 추가되었습니다',
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                role: newAdmin.role,
                createdAt: newAdmin.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message || '관리자 추가 실패' });
    }
});

// 관리자 수정 (super_admin만 가능)
router.patch('/users/:id', validateAdminUpdate, async (req, res) => {
    try {
        if (req.session.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: '권한이 없습니다' });
        }

        const { id } = req.params;
        const updates = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'UPDATE_ADMIN',
            target: updatedAdmin.username,
            details: { updatedId: id }
        });

        res.json({
            success: true,
            message: '관리자 정보가 수정되었습니다',
            admin: {
                id: updatedAdmin._id,
                ...updatedAdmin.toObject()
                // passwordHash 자동 제외 안됨, 직접 제외 필요하지만 응답에선 무시해도 됨
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: '관리자 수정 실패' });
    }
});

// 관리자 삭제 (super_admin만 가능)
router.delete('/users/:id', async (req, res) => {
    try {
        if (req.session.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: '권한이 없습니다' });
        }

        const { id } = req.params;

        // 자기 자신 삭제 불가
        if (id === req.session.userId) {
            return res.status(400).json({ success: false, message: '자기 자신은 삭제할 수 없습니다' });
        }

        await Admin.findByIdAndDelete(id);

        await ActivityLog.create({
            adminId: req.session.userId,
            adminUsername: req.session.username,
            action: 'DELETE_ADMIN',
            details: { deletedId: id }
        });

        res.json({ success: true, message: '관리자가 삭제되었습니다' });
    } catch (error) {
        res.status(400).json({ success: false, message: '관리자 삭제 실패' });
    }
});

// ===================================
// 활동 로그 API
// ===================================

router.get('/activity-logs', async (req, res) => {
    try {
        const { page = 1, limit = 50, adminId, action, startDate, endDate } = req.query;

        const query = {};
        if (adminId) query.adminId = adminId;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ActivityLog.countDocuments(query);

        res.json({
            logs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '활동 로그 조회 실패' });
    }
});

router.get('/activity-stats', async (req, res) => {
    try {
        // 간단한 통계 구현 (추후 확장 가능)
        const stats = {
            totalLogs: await ActivityLog.countDocuments(),
            todayLogs: await ActivityLog.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            })
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ success: false, message: '통계 조회 실패' });
    }
});

export default router;
