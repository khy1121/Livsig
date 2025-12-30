// 활동 로그 데이터 (메모리 저장)
let activityLogs = [];
let nextLogId = 1;

// 로그 추가
export function addActivityLog(adminId, adminUsername, action, target, details = {}) {
    const log = {
        id: nextLogId++,
        adminId,
        adminUsername,
        action, // 'LOGIN', 'LOGOUT', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'UPDATE_ORDER', etc.
        target, // 상품 ID, 주문 ID 등
        details, // 추가 정보
        timestamp: new Date().toISOString(),
        ipAddress: details.ipAddress || 'unknown'
    };

    activityLogs.push(log);

    // 메모리 관리: 최근 1000개만 유지
    if (activityLogs.length > 1000) {
        activityLogs = activityLogs.slice(-1000);
    }

    return log;
}

// 로그 조회 (페이지네이션)
export function getActivityLogs(page = 1, limit = 50, filters = {}) {
    let filtered = [...activityLogs];

    // 필터링
    if (filters.adminId) {
        filtered = filtered.filter(log => log.adminId === filters.adminId);
    }
    if (filters.action) {
        filtered = filtered.filter(log => log.action === filters.action);
    }
    if (filters.startDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }

    // 정렬 (최신순)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filtered.slice(startIndex, endIndex);

    return {
        logs: paginatedLogs,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit)
    };
}

// 특정 관리자의 최근 활동
export function getRecentActivityByAdmin(adminId, limit = 10) {
    return activityLogs
        .filter(log => log.adminId === adminId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

// 로그 통계
export function getActivityStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
        total: activityLogs.length,
        today: activityLogs.filter(log => new Date(log.timestamp) >= today).length,
        thisWeek: activityLogs.filter(log => new Date(log.timestamp) >= thisWeek).length,
        byAction: activityLogs.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {})
    };
}
