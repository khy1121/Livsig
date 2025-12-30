import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = 3001;

// CORS 설정 - Vite 개발 서버와 통신 허용
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 쿠키 파서
app.use(cookieParser());

// 세션 설정
app.use(session({
    secret: 'sigliv-admin-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // 개발 환경 (프로덕션에서는 true)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
}));

// 로깅 미들웨어
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: 'Signal Living Admin API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            admin: '/api/admin'
        }
    });
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        error: '요청한 페이지를 찾을 수 없습니다'
    });
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || '서버 오류가 발생했습니다'
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`\n🚀 Signal Living Admin Server`);
    console.log(`📡 포트: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔐 관리자 계정: admin / sigliv2024!\n`);
});
