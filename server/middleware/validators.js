import { body, validationResult } from 'express-validator';

// 유효성 검사 결과 처리 미들웨어
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg, // 첫 번째 에러 메시지만 반환
            errors: errors.array()
        });
    }
    next();
};

// 로그인 유효성 검사
export const validateLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('아이디를 입력해주세요'),
    body('password')
        .notEmpty().withMessage('비밀번호를 입력해주세요'),
    validate
];

// 상품 생성/수정 유효성 검사
export const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('상품명을 입력해주세요'),
    body('category')
        .trim()
        .notEmpty().withMessage('카테고리를 입력해주세요'),
    body('price')
        .isFloat({ min: 0 }).withMessage('가격은 0 이상의 숫자여야 합니다'),
    body('stock')
        .isInt({ min: 0 }).withMessage('재고는 0 이상의 정수여야 합니다'),
    body('description')
        .optional()
        .trim(),
    validate
];

// 관리자 생성 유효성 검사
export const validateAdminCreate = [
    body('username')
        .trim()
        .notEmpty().withMessage('아이디를 입력해주세요')
        .isLength({ min: 4 }).withMessage('아이디는 4자 이상이어야 합니다'),
    body('password')
        .notEmpty().withMessage('비밀번호를 입력해주세요')
        .isLength({ min: 6 }).withMessage('비밀번호는 6자 이상이어야 합니다'),
    body('role')
        .optional()
        .isIn(['admin', 'super_admin']).withMessage('유효하지 않은 권한입니다'),
    validate
];

// 관리자 수정 유효성 검사
export const validateAdminUpdate = [
    body('username')
        .optional()
        .trim()
        .notEmpty().withMessage('아이디를 입력해주세요')
        .isLength({ min: 4 }).withMessage('아이디는 4자 이상이어야 합니다'),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('비밀번호는 6자 이상이어야 합니다'),
    body('role')
        .optional()
        .isIn(['admin', 'super_admin']).withMessage('유효하지 않은 권한입니다'),
    validate
];
