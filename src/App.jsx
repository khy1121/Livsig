import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Customer Homepage */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                {/* Admin Login */}
                <Route path="/admin/login" element={<Login />} />

                {/* Admin Dashboard (Protected) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

