import express from 'express';

const router = express.Router();

// 하드코딩된 관리자 자격 증명 (프로덕션에서는 환경 변수 사용)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'sigliv2024!'
};

// 로그인
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password) {
        // 세션 생성
        req.session.userId = 1;
        req.session.username = username;

        res.json({
            success: true,
            user: { username }
        });
    } else {
        res.status(401).json({
            success: false,
            message: '아이디 또는 비밀번호가 올바르지 않습니다'
        });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: '로그아웃 중 오류가 발생했습니다'
            });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// 인증 상태 확인
router.get('/check', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            authenticated: true,
            user: { username: req.session.username }
        });
    } else {
        res.json({ authenticated: false });
    }
});

export default router;
