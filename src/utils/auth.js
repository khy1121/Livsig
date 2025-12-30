const API_URL = 'http://localhost:3001/api';

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        return await response.json();
    } catch (error) {
        console.error('로그인 오류:', error);
        return { success: false, message: '서버 연결 오류' };
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        return await response.json();
    } catch (error) {
        console.error('로그아웃 오류:', error);
        return { success: false };
    }
};

export const checkAuth = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include',
        });

        return await response.json();
    } catch (error) {
        console.error('인증 확인 오류:', error);
        return { authenticated: false };
    }
};

export const fetchAdminStats = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            credentials: 'include',
        });

        if (!response.ok) throw new Error('통계 조회 실패');
        return await response.json();
    } catch (error) {
        console.error('통계 조회 오류:', error);
        return null;
    }
};

export const fetchOrders = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/orders`, {
            credentials: 'include',
        });

        if (!response.ok) throw new Error('주문 조회 실패');
        return await response.json();
    } catch (error) {
        console.error('주문 조회 오류:', error);
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/products`, {
            credentials: 'include',
        });

        if (!response.ok) throw new Error('상품 조회 실패');
        return await response.json();
    } catch (error) {
        console.error('상품 조회 오류:', error);
        return [];
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status }),
        });

        return await response.json();
    } catch (error) {
        console.error('주문 상태 변경 오류:', error);
        return { success: false };
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await fetch(`${API_URL}/admin/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(productData),
        });

        return await response.json();
    } catch (error) {
        console.error('상품 추가 오류:', error);
        return { success: false };
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await fetch(`${API_URL}/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(productData),
        });

        return await response.json();
    } catch (error) {
        console.error('상품 수정 오류:', error);
        return { success: false };
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/admin/products/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        return await response.json();
    } catch (error) {
        console.error('상품 삭제 오류:', error);
        return { success: false };
    }
};
