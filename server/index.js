import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import { seedDatabase } from './utils/seed.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import productsRoutes from './routes/products.js';

// 환경 변수 로드
dotenv.config();

// MongoDB 연결
await connectDatabase();

// 초기 데이터 시딩
await seedDatabase();

// ES 모듈에서 __dirname 사용
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 보안 미들웨어 - Helmet
app.use(helmet());

// Rate Limiting - 로그인 엔드포인트
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 5, // 15분당 5회 시도
    message: '너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.',
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS 설정 - Vite 개발 서버와 통신 허용
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 정적 파일 제공 (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET || 'sigliv-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
}));


// 라우트 등록
app.use('/api/auth', loginLimiter, authRoutes); // Rate limiter 적용
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productsRoutes); // 공개 API

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
