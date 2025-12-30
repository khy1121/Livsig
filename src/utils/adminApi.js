// 관리자 사용자 관리 API 함수들

const API_BASE = 'http://localhost:3001/api/admin';

// 관리자 목록 조회
export async function getAdminUsers() {
    const response = await fetch(`${API_BASE}/users`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('관리자 목록 조회 실패');
    }

    return await response.json();
}

// 관리자 추가
export async function createAdminUser(username, password, role = 'admin') {
    const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, role })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '관리자 추가 실패');
    }

    return data;
}

// 관리자 수정
export async function updateAdminUser(id, updates) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updates)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '관리자 수정 실패');
    }

    return data;
}

// 관리자 삭제
export async function deleteAdminUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '관리자 삭제 실패');
    }

    return data;
}

// 활동 로그 조회
export async function fetchActivityLogs(page = 1, limit = 50, filters = {}) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
    });

    const response = await fetch(`${API_BASE}/activity-logs?${params}`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('활동 로그 조회 실패');
    }

    return await response.json();
}

// 활동 로그 통계
export async function getActivityStats() {
    const response = await fetch(`${API_BASE}/activity-stats`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('통계 조회 실패');
    }

    return await response.json();
}
