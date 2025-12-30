import { useState } from 'react';
import { updateOrderStatus } from '../utils/auth';
import './OrderDetailModal.css';

export default function OrderDetailModal({ order, onClose, onUpdate }) {
    const [status, setStatus] = useState(order?.status || '주문확인');
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (newStatus) => {
        if (updating) return;

        setUpdating(true);
        setStatus(newStatus);

        // API 호출로 상태 업데이트
        const result = await updateOrderStatus(order.id, newStatus);

        if (result.success) {
            await onUpdate();
        } else {
            // 실패 시 원래 상태로 복원
            setStatus(order.status);
            alert('주문 상태 변경에 실패했습니다.');
        }

        setUpdating(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    if (!order) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content order-detail" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>주문 상세 정보</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="info-section">
                        <h3>주문 정보</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">주문번호</span>
                                <span className="info-value">{order.orderNumber}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">주문일시</span>
                                <span className="info-value">{order.date}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">고객명</span>
                                <span className="info-value">{order.customer}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">주문금액</span>
                                <span className="info-value highlight">{formatCurrency(order.amount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>주문 상태 {updating && <span className="updating-text">(변경 중...)</span>}</h3>
                        <div className="status-buttons">
                            <button
                                className={`status-btn ${status === '주문확인' ? 'active' : ''}`}
                                onClick={() => handleStatusChange('주문확인')}
                                disabled={updating}
                            >
                                주문확인
                            </button>
                            <button
                                className={`status-btn ${status === '배송중' ? 'active' : ''}`}
                                onClick={() => handleStatusChange('배송중')}
                                disabled={updating}
                            >
                                배송중
                            </button>
                            <button
                                className={`status-btn ${status === '배송완료' ? 'active' : ''}`}
                                onClick={() => handleStatusChange('배송완료')}
                                disabled={updating}
                            >
                                배송완료
                            </button>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>주문 상품</h3>
                        <div className="order-items">
                            <div className="order-item">
                                <div className="item-info">
                                    <span className="item-name">프리미엄 파자마 세트</span>
                                    <span className="item-option">사이즈: M, 색상: 베이지</span>
                                </div>
                                <div className="item-price">
                                    <span className="item-quantity">1개</span>
                                    <span className="item-amount">{formatCurrency(89000)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>배송 정보</h3>
                        <div className="delivery-info">
                            <p><strong>받는 사람:</strong> {order.customer}</p>
                            <p><strong>연락처:</strong> 010-1234-5678</p>
                            <p><strong>주소:</strong> 서울시 강남구 테헤란로 123, 456호</p>
                            <p><strong>배송 요청사항:</strong> 문 앞에 놓아주세요</p>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-close" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
