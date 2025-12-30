import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 사용자 페이지 (기본) */}
                <Route path="/" element={<Home />} />

                {/* 관리자 로그인 */}
                <Route path="/admin/login" element={<Login />} />

                {/* 관리자 대시보드 및 사용자 관리 (보호됨) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
