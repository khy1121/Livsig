import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validateLogin } from '../middleware/validators.js';
import Admin from '../models/Admin.model.js';
import ActivityLog from '../models/ActivityLog.model.js';

const router = express.Router();

// 로그인
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { username, password } = req.body;

        // DB에서 사용자 찾기
        const admin = await Admin.findOne({ username });
        if (!admin) {
            // 보안을 위해 상세 이유 숨김
            await ActivityLog.create({
                adminId: null,
                adminUsername: username, // 시도한 ID
                action: 'LOGIN_FAILED',
                details: { reason: 'User not found' },
                ipAddress: req.ip
            });
            return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다' });
        }

        // 비밀번호 검증 (Admin 모델 메서드 사용)
        const isValid = await admin.verifyPassword(password);
        if (isValid) {
            req.session.userId = admin._id;
            req.session.username = admin.username;
            req.session.role = admin.role;

            // 마지막 로그인 시간 업데이트
            admin.lastLogin = new Date();
            await admin.save();

            // 활동 로그
            await ActivityLog.create({
                adminId: admin._id,
                adminUsername: admin.username,
                action: 'LOGIN',
                ipAddress: req.ip
            });

            res.json({
                success: true,
                message: '로그인 성공',
                user: {
                    id: admin._id,
                    username: admin.username,
                    role: admin.role
                }
            });
        } else {
            await ActivityLog.create({
                adminId: admin._id,
                adminUsername: admin.username,
                action: 'LOGIN_FAILED',
                details: { reason: 'Invalid password' },
                ipAddress: req.ip
            });
            res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: '로그인 처리 중 오류 발생' });
    }
});

// 로그아웃
router.post('/logout', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const username = req.session.username;

        req.session.destroy(async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: '로그아웃 실패' });
            }

            if (userId && username) {
                // 로그아웃은 세션 파괴 후에 기록하므로 await 안 해도 됨 (fire and forget)
                ActivityLog.create({
                    adminId: userId,
                    adminUsername: username,
                    action: 'LOGOUT',
                    ipAddress: req.ip
                }).catch(console.error);
            }

            res.clearCookie('connect.sid');
            res.json({ success: true, message: '로그아웃 되었습니다' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

// 인증 상태 확인
router.get('/check', (req, res) => {
    if (req.session.userId) {
        res.json({
            authenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.role
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;
