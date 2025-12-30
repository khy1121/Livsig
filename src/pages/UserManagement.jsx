import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../utils/adminApi';
import './UserManagement.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAdminUsers();
            setUsers(data);
        } catch (error) {
            toast.error('관리자 목록 로딩 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingUser) {
                await updateAdminUser(editingUser.id, formData);
                toast.success('관리자 정보가 수정되었습니다');
            } else {
                await createAdminUser(formData.username, formData.password, formData.role);
                toast.success('관리자가 추가되었습니다');
            }

            setShowModal(false);
            setFormData({ username: '', password: '', role: 'admin' });
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            password: '',
            role: user.role
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteAdminUser(id);
            toast.success('관리자가 삭제되었습니다');
            loadUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getRoleBadge = (role) => {
        return role === 'super_admin' ?
            <span className="badge badge-super">슈퍼관리자</span> :
            <span className="badge badge-admin">관리자</span>;
    };

    return (
        <div className="user-management">
            <Toaster position="top-right" />

            <div className="page-header">
                <h1>사용자 관리</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + 관리자 추가
                </button>
            </div>

            {loading ? (
                <div className="loading">로딩 중...</div>
            ) : (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>사용자명</th>
                                <th>권한</th>
                                <th>생성일</th>
                                <th>마지막 로그인</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(user)}>
                                            수정
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingUser ? '관리자 수정' : '관리자 추가'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>사용자명</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    disabled={editingUser}
                                />
                            </div>
                            <div className="form-group">
                                <label>비밀번호 {editingUser && '(변경 시에만 입력)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                    minLength={6}
                                />
                            </div>
                            <div className="form-group">
                                <label>권한</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin">관리자</option>
                                    <option value="super_admin">슈퍼관리자</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    취소
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editingUser ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
