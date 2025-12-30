export const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.user = { username: req.session.username };
        next();
    } else {
        res.status(401).json({
            success: false,
            message: '인증이 필요합니다'
        });
    }
};
