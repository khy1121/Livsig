import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addProduct, updateProduct, uploadImage } from '../utils/auth';
import './ProductModal.css';

export default function ProductModal({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'pajamas',
        price: '',
        stock: '',
        status: '판매중',
        description: '',
        imageUrl: ''
    });
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || 'pajamas',
                price: product.price || '',
                stock: product.stock || '',
                status: product.status || '판매중',
                description: product.description || '',
                imageUrl: product.imageUrl || ''
            });
            if (product.imageUrl) {
                setImagePreview(product.imageUrl);
            }
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크 (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('이미지 크기는 5MB 이하여야 합니다');
                return;
            }

            // 파일 타입 체크
            if (!file.type.startsWith('image/')) {
                toast.error('이미지 파일만 업로드 가능합니다');
                return;
            }

            setImageFile(file);

            // 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;
        setSaving(true);

        try {
            let imageUrl = formData.imageUrl;

            // 새 이미지가 선택된 경우 업로드
            if (imageFile) {
                const uploadToast = toast.loading('이미지 업로드 중...');
                const uploadResult = await uploadImage(imageFile);

                if (uploadResult.success) {
                    imageUrl = uploadResult.url;
                    toast.success('이미지 업로드 완료', { id: uploadToast });
                } else {
                    toast.error('이미지 업로드 실패', { id: uploadToast });
                    setSaving(false);
                    return;
                }
            }

            // 상품 데이터에 이미지 URL 포함
            const productData = {
                ...formData,
                imageUrl
            };

            let result;
            if (product) {
                result = await updateProduct(product.id, productData);
                if (result.success) {
                    toast.success('상품이 수정되었습니다');
                }
            } else {
                result = await addProduct(productData);
                if (result.success) {
                    toast.success('상품이 추가되었습니다');
                }
            }

            if (result.success) {
                await onSave();
                onClose();
            } else {
                toast.error(result.message || '저장에 실패했습니다');
            }
        } catch (error) {
            toast.error('오류가 발생했습니다');
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
                    {/* 이미지 업로드 */}
                    <div className="form-group">
                        <label htmlFor="image">상품 이미지</label>
                        <div className="image-upload-container">
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="미리보기" />
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={saving}
                                className="file-input"
                            />
                            <label htmlFor="image" className="file-label">
                                {imagePreview ? '이미지 변경' : '이미지 선택'}
                            </label>
                            <p className="file-hint">JPG, PNG, GIF, WEBP (최대 5MB)</p>
                        </div>
                    </div>

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
