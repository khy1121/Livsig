import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const result = await checkAuth();
            setIsAuthenticated(result.authenticated);
            setLoading(false);
        };

        verifyAuth();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontSize: '18px',
                color: '#7F8C8D'
            }}>
                인증 확인 중...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
