import { useState, useEffect } from 'react';
import { fetchActivityLogs } from '../utils/adminApi';
import toast from 'react-hot-toast';

export default function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadLogs();
    }, [page]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await fetchActivityLogs({ page, limit: 20 });
            setLogs(data.logs);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            toast.error('활동 로그를 불러오지 못했습니다');
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action) => {
        let color = '#999';
        if (action.includes('LOGIN')) color = '#3498DB';
        if (action.includes('CREATE')) color = '#27AE60';
        if (action.includes('DELETE')) color = '#E74C3C';
        if (action.includes('UPDATE')) color = '#F39C12';

        return (
            <span style={{
                backgroundColor: color,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
            }}>
                {action}
            </span>
        );
    };

    if (loading && logs.length === 0) return <div className="loading">로그를 불러오는 중...</div>;

    return (
        <div className="activity-logs">
            <div className="view-header">
                <h2>활동 로그</h2>
                <button className="btn-secondary" onClick={loadLogs}>🔄 새로고침</button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>시간</th>
                            <th>관리자</th>
                            <th>활동</th>
                            <th>대상</th>
                            <th>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log._id || log.id}>
                                <td>{new Date(log.timestamp || log.createdAt).toLocaleString()}</td>
                                <td>{log.adminUsername || '시스템'}</td>
                                <td>{getActionBadge(log.action)}</td>
                                <td>{log.target || '-'}</td>
                                <td>{log.ipAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    이전
                </button>
                <span>{page} / {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
}
