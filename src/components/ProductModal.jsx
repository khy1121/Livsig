import { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../utils/auth';
import './ProductModal.css';

export default function ProductModal({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'pajamas',
        price: '',
        stock: '',
        status: '판매중',
        description: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || 'pajamas',
                price: product.price || '',
                stock: product.stock || '',
                status: product.status || '판매중',
                description: product.description || ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;
        setSaving(true);

        try {
            let result;
            if (product) {
                // 수정
                result = await updateProduct(product.id, formData);
            } else {
                // 추가
                result = await addProduct(formData);
            }

            if (result.success) {
                await onSave();
                onClose();
            } else {
                alert(result.message || '저장에 실패했습니다.');
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product ? '상품 수정' : '상품 추가'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">상품명 *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="상품명을 입력하세요"
                            disabled={saving}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">카테고리 *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                disabled={saving}
                            >
                                <option value="pajamas">파자마</option>
                                <option value="slippers">슬리퍼</option>
                                <option value="aprons">앞치마</option>
                                <option value="bedding">침구</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">상태 *</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                disabled={saving}
                            >
                                <option value="판매중">판매중</option>
                                <option value="품절">품절</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">가격 (원) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="0"
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">재고 *</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="0"
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">상품 설명</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="상품 설명을 입력하세요"
                            disabled={saving}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={saving}>
                            취소
                        </button>
                        <button type="submit" className="btn-submit" disabled={saving}>
                            {saving ? '저장 중...' : (product ? '수정' : '추가')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
